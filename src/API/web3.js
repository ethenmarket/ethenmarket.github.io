import Web3 from "web3";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import ProviderEngine from "web3-provider-engine";
import FetchSubprovider from "web3-provider-engine/subproviders/fetch";
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import TX from 'ethereumjs-tx';
import { Buffer } from 'buffer';
import { promisify } from 'es6-promisify';
import { privateToAddress, addHexPrefix, toBuffer, hashPersonalMessage, ecsign, toRpcSig } from 'ethereumjs-util';

import networks from './networks.json';

let ledgerWeb3 = null;
let metaMaskWeb3 = null;
let privateWeb3 = null;

export const LEDGER = 'ledger';
export const METAMASK = 'metamask';
export const PRIVATE_KEY = 'private_key';
// configuration can be overrided by env variables
const rpcUrl = networks[process.env.REACT_APP_NETWORK_URL] || "https://infura.io/vwKftuetCYx3UrQwH5gH"; // TODO CHANGE TO MAINNET
const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || "1", 10);

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

// export const getReadOnlyWeb3 = async () => {
//   const engine = new ProviderEngine();
//   engine.addProvider(new FetchSubprovider({ rpcUrl }));
//   engine.start();
//   return new Web3(engine);
// };


// we define all wallets exposing a way to get a web3 instance.
export default {
  // create a web3 with the ledger device
  [LEDGER]: async () => {
    if (ledgerWeb3) return ledgerWeb3;
    const engine = new ProviderEngine();
    const getTransport = () => TransportU2F.create();
    const ledger = await createLedgerSubprovider(getTransport, {
      networkId,
      accountsLength: 5
    });
    engine.addProvider(ledger);
    engine.addProvider(new FetchSubprovider({ rpcUrl }));
    engine.start();
    ledgerWeb3 = new Web3(engine);
    return ledgerWeb3;
  },
  // detect extension like Mist/MetaMask
  [METAMASK]: () => {
    if (metaMaskWeb3) return metaMaskWeb3;
    const { web3 } = window;
    if (!web3) return null;
    metaMaskWeb3 = new Web3(web3.currentProvider);
    return metaMaskWeb3;
  },
  [PRIVATE_KEY]: () => {
    if (privateWeb3) return privateWeb3;
    privateWeb3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    window.pr = privateWeb3;
    return privateWeb3;
  }
};

export const getTypedDataForOrder = ({
  userAddress,
  contractAddress,
  orderType,
  tokenAddress,
  price, // eth
  amount, // with decimals
  expire, // timestamp
  nonce
}) => [
  [
    {
      "name": "Contract",
      "type": "address",
      "value": contractAddress.toString()
    },
    {
      "name": "Order",
      "type": "string",
      "value": orderType.toString()
    },
    {
      "name": "Token",
      "type": "address",
      "value": tokenAddress.toString()
    },
    {
      "name": "Nonce",
      "type": "uint",
      "value": nonce.toString(10)
    },
    {
      "name": "Price",
      "type": "uint",
      "value": price.toString(10)
    },
    {
      "name": "Amount",
      "type": "uint",
      "value": amount.toString(10)
    },
    {
      "name": "Expire",
      "type": "uint",
      "value": expire.toString(10)
    }
  ],
  userAddress
];

export const withDecimals = (number, decimals) => BigNumber(number).times(
  BigNumber(10).pow(decimals)
).toString();


let ethenContract;
export const getContract = async (web3, address) => {
  if (ethenContract) return ethenContract;
  const { data } = await axios.get(`/ABI/ethen.json`);
  const EthenContract = web3.eth.contract(data);
  ethenContract = EthenContract.at(address);

  return ethenContract;
};

let ERC20Contract;
export const getERC20Contract = async (web3, address) => {
  if (ERC20Contract) return ERC20Contract.at(address);
  const { data } = await axios.get(`/ABI/ERC20.json`);
  ERC20Contract = web3.eth.contract(data);
  return ERC20Contract.at(address);
};

export const getVfromSign = sign => parseInt(sign.slice(130), 16);
export const getRfromSign = sign => `0x${sign.slice(2, 66)}`; // shifted 2 cause '0x' at the begin
export const getSfromSign = sign => `0x${sign.slice(66, 130)}`;


export const getUserAddress = (web3, provider) => provider === PRIVATE_KEY ? web3.eth.defaultAccount : web3.eth.accounts[0];
export const getAddressFromPK = (pk) => {
  let address = privateToAddress(Buffer.from(pk, 'hex'));
  address = addHexPrefix(address.toString('hex'));
  return address;
};

export const getSignedRawTransaction = async (web3, raw, privateKey) => {
  const address = getAddressFromPK(privateKey);
  const nonce = await promisify(web3.eth.getTransactionCount.bind(web3.eth))(address);
  const txRaw = {
    nonce,
    from: address,
    ...raw,
    value: addHexPrefix(BigNumber(raw.value || 0).toString(16))
  };
  const tx = new TX(txRaw);
  tx.sign(Buffer.from(privateKey, 'hex'));
  return addHexPrefix(tx.serialize().toString('hex'));
};

export const sendRawTransaction = async (web3, raw, privateKey) => {
  const signedRaw = await getSignedRawTransaction(web3, raw, privateKey);
  return promisify(web3.eth.sendRawTransaction.bind(web3.eth))(signedRaw);
};


const leftPad = (str, len, pad) => {
  if (str.length >= len) { return str; }
  return pad.repeat(len - str.length) + str;
};

const del0x = (hex) => {
  if (hex.substr(0, 2) === "0x") { return hex.substr(2); }
  return hex;
};

// returns number in hex form
const num2hex = (num, bytes) => {
  const hex = BigNumber(num).toString(16);
  return leftPad(del0x(hex), bytes * 2, "0");
};

export const getTradeMessage = (ethenAddr, order) => Buffer.concat([
  toBuffer(ethenAddr),
  toBuffer(`0x${num2hex(order.type, 1)}`), // number
  toBuffer(order.token),
  toBuffer(`0x${num2hex(order.nonce, 32)}`),
  toBuffer(`0x${num2hex(order.price, 32)}`),
  toBuffer(`0x${num2hex(order.amount, 32)}`),
  toBuffer(`0x${num2hex(order.expire, 32)}`)
]).toString('hex');

export const signMessage = async (web3, { provider, data, from, privateKey = '' }) => {
  let signature;
  let newHash = false;
  const { typed, message } = data;
  if (provider === METAMASK) {
    newHash = true;
    const { result, error } = await promisify(web3.currentProvider.sendAsync.bind(web3.currentProvider))({
      method: "eth_signTypedData",
      from,
      jsonrpc: "2.0",
      params: typed
    });
    if (error) throw new Error(error.message);
    signature = result;
  } else {
    const messageHash = hashPersonalMessage(toBuffer(message));
    console.log('Signing message: ', message);

    if (provider === PRIVATE_KEY) {
      const { s, r, v } = ecsign(messageHash, toBuffer(addHexPrefix(privateKey)));
      signature = toRpcSig(v, r, s);
    }
    if (provider === LEDGER) {
      signature = promisify(web3.eth.signPersonalMessage.bind(web3.eth))({
        from: "m/44'/60'/0'", // default path for ledger https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
        data: messageHash.toString('hex')
      });
    }
  }
  console.log('Signature: ', signature);

  return {
    signature,
    newHash
  };
};