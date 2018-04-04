import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { delay } from "redux-saga";
import { promisify } from "es6-promisify";
import BigNumber from "bignumber.js";
import handleError from "./errors";

import API, { NEW_TX_METHODS } from "../API";
import getWeb3, {
  getERC20Contract,
  getContract,
  PRIVATE_KEY,
  sendRawTransaction
} from "../API/web3";

import { GET_BALANCES, DEPOSIT, WITHDRAW, TRANSFER } from "../reducers/actions";
import {
  updateBalances,
  balancesLoadingError,
  waitApproving,
  approvingError,
  approvingSuccess,
  updateTokenBalance
} from "../reducers/balances";
import { getCurrentToken } from "../reducers/tokens";
import { zeroAddress } from "../reducers/user";

import { fromEtherToWei, fromNormalTokenToBase } from "../utils";
import { newTransaction } from "../reducers/notifications";

async function getTokenBalance (web3, userAddress, tokenAddress, contractAddress) {
  const addr = userAddress.substring(2);
  const contractData = `0x70a08231000000000000000000000000${addr}`;
  const ethCall = promisify(web3.eth.call.bind(web3.eth));
  const wallet = await ethCall({ to: tokenAddress, data: contractData }).then(
    val => (val === "0x" ? "0" : BigNumber(val).toString())
  );

  const ethenContract = await getContract(web3, contractAddress);
  const ethen = await promisify(ethenContract.tokens.bind(ethenContract))(userAddress, tokenAddress).then(
    val => (val === "0x" ? "0" : BigNumber(val).toString())
  );
  return {
    wallet,
    ethen
  };
}

export function* getCurrentTokenWalletBalance() {
  const providerType = yield select(state => state.web3Provider.current);
  const web3 = yield call(getWeb3[providerType]);
  const currentToken = yield select(getCurrentToken);
  const userAddress = yield select(state => state.user.address);
  const tokenWalletBalance = yield call(
    getTokenBalance,
    web3,
    userAddress,
    currentToken.address
  );
  yield put(
    updateTokenBalance({
      address: currentToken.address,
      balance: tokenWalletBalance
    })
  );
}

function* getAllTokensBalances(web3, userAddress, tokensAddresses, contractAddress) {
  const tokenBalances = [];
  const concurentRequestCount = 3;
  while (tokensAddresses.length) {
    const forRequest = tokensAddresses.slice(0, concurentRequestCount);
    tokensAddresses = tokensAddresses.slice(concurentRequestCount);
    const results = yield call(
      [Promise, Promise.all],
      forRequest.map(address => getTokenBalance(web3, userAddress, address, contractAddress))
    );

    tokenBalances.push(
      ...results.map((val, i) => ({
        wallet: val.wallet,
        ethen: val.ethen,
        address: forRequest[i]
      }))
    );
  }
  return tokenBalances;
}

function* getBalances() {
  try {
    const userAddress = yield select(state => state.user.address);
    const contract = yield select(state => state.contract.current);

    const tokens = yield select(state => state.tokens.addressesList);
    const providerType = yield select(state => state.web3Provider.current);
    const web3 = yield call(getWeb3[providerType]);
    const etherBalance = yield call(
      promisify(web3.eth.getBalance.bind(web3.eth)),
      userAddress
    );

    const ethenContract = yield call(getContract, web3, contract);
    const etherBalanceEthen = yield call(
      promisify(ethenContract.balances.bind(ethenContract)),
      userAddress
    );

    const tokensBalances = yield getAllTokensBalances(
      web3,
      userAddress,
      tokens,
      contract
    );
    const result = {
      ether: {
        wallet: etherBalance.toString(),
        ethen: etherBalanceEthen.toString() // data.ether
      },
      tokens: {}
    };
    tokensBalances.forEach(walletToken => {
      if (!result.tokens[walletToken.address]) result.tokens[walletToken.address] = {};
      result.tokens[walletToken.address] = walletToken;
    });

    yield put(updateBalances(result));
  } catch (e) {
    yield put(balancesLoadingError());
    yield handleError(e);
  }
}

function* moveFunds(action) {
  try {
    const userAddress = yield select(state => state.user.address);
    if (!userAddress || userAddress === zeroAddress)
      throw new Error(
        "Please unlock your wallet or use private key (not recomended)"
      );

    const providerType = yield select(state => state.web3Provider.current);
    const web3 = yield call(getWeb3[providerType]);
    const gasPrice = yield select(state => state.balances.gasPrice);
    const contractAddress = yield select(state => state.contract.current);
    const currentToken = yield select(getCurrentToken);
    const { decimals, address: tokenAddress } = currentToken;

    const {
      amount,
      address: transferToAddress,
      isEtherActive
    } = action.payload;

    const contractInstance = yield call(getContract, web3, contractAddress);
    const tokenInstance = yield call(getERC20Contract, web3, tokenAddress);
    const privateKey = yield select(state => state.web3Provider.privateKey);

    if (action.type === DEPOSIT) {
      if (isEtherActive) {
        let hash;
        const realValue = fromEtherToWei(amount).toString();
        if (providerType === PRIVATE_KEY) {
          // DEPOSIT ether private
          const txRaw = {
            from: userAddress,
            to: contractAddress,
            gasLimit: 100000, // TODO change to constant
            value: realValue,
            gasPrice,
            data: contractInstance.depositEther.getData()
          };
          hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
        } else {
          // DEPOSIT ether metamask or ledger
          hash = yield call(
            promisify(contractInstance.depositEther.bind(contractInstance)),
            {
              from: userAddress,
              value: realValue,
              gasPrice
            }
          );
        }
        yield put(newTransaction(hash));
        console.log('Deposit ether: ', hash);
        try {
          yield call(API.newTX, {
            method: NEW_TX_METHODS.ETHER_DEPOSITED,
            contract: contractAddress,
            user: userAddress,
            txhash: hash,
            amount: realValue
          });
        } catch (e) {
          console.error(e);
        }

      } else {
        // DEPOSIT tokens
        const wasApproved = "was approved early";
        let receipt = wasApproved;
        const getTransactionReceipt = promisify(
          web3.eth.getTransactionReceipt.bind(web3.eth)
        );
        let approveHash;
        const realAmount = fromNormalTokenToBase(amount, decimals).toString();
        const approvedAmount = yield call(
          promisify(tokenInstance.allowance.bind(tokenInstance)),
          userAddress,
          contractAddress,
          {
            from: userAddress
          }
        );
        try {
          if (approvedAmount.lt(realAmount)) {
            yield put(waitApproving());
            if (providerType === PRIVATE_KEY) {
              const txRaw = {
                from: userAddress,
                to: tokenAddress,
                gasPrice,
                gasLimit: 100000, // TODO change to constant
                data: tokenInstance.approve.getData(contractAddress, realAmount)
              };
              approveHash = yield call(
                sendRawTransaction,
                web3,
                txRaw,
                privateKey
              );
            } else {
              approveHash = yield call(
                promisify(tokenInstance.approve.bind(tokenInstance)),
                contractAddress,
                BigNumber(realAmount)
                  .times(10)
                  .toString(),
                {
                  from: userAddress,
                  gasPrice
                }
              );
            }
            yield put(newTransaction(approveHash));
            while (!receipt || receipt === wasApproved) {
              yield delay(800);
              receipt = yield call(getTransactionReceipt, approveHash);
            }
          }

          if (parseInt(receipt.status, 16) === 1 || receipt === wasApproved) {
            if (receipt !== wasApproved) yield put(approvingSuccess());
            let depositHash;
            if (providerType === PRIVATE_KEY) {
              const txRaw = {
                from: userAddress,
                to: contractAddress,
                gasPrice,
                gasLimit: 100000, // TODO to constant
                data: contractInstance.depositToken.getData(
                  tokenAddress,
                  realAmount
                )
              };
              depositHash = yield call(
                sendRawTransaction,
                web3,
                txRaw,
                privateKey
              );
            } else {

              depositHash = yield call(
                promisify(contractInstance.depositToken.bind(contractInstance)),
                tokenAddress,
                realAmount,
                {
                  from: userAddress,
                  gasPrice,
                  gasLimit: 100000
                }
              );
              console.log(depositHash);
            }

            yield put(newTransaction(depositHash));
            console.log('Deposit token', depositHash);
            try {
              yield call(API.newTX, {
                method: NEW_TX_METHODS.TOKEN_DEPOSITED,
                contract: contractAddress,
                user: userAddress,
                txhash: depositHash,
                amount: realAmount,
                token: tokenAddress
              });
            } catch (e) {
              console.error(e);
            }
          } else {
            yield put(approvingError());
            throw new Error(`Transaction: ${approveHash} is failed`);
          }
        } catch (e) {
          yield put(approvingError());
          throw e;
        }
      }
    }

    if (action.type === WITHDRAW) {
      if (isEtherActive) {
        // WITHDRAW ether
        let hash;
        const realAmount = fromEtherToWei(amount).toString();
        if (providerType === PRIVATE_KEY) {
          const txRaw = {
            from: userAddress,
            to: contractAddress,
            gasPrice,
            gasLimit: 100000, // TODO to constant
            data: contractInstance.withdrawEther.getData(realAmount)
          };
          hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
        } else {
          hash = yield call(
            promisify(contractInstance.withdrawEther.bind(contractInstance)),
            realAmount,
            {
              from: userAddress,
              gasPrice
            }
          );
        }
        yield put(newTransaction(hash));
        console.log('Withdraw ether: ', hash);
        try {
          yield call(API.newTX, {
            method: NEW_TX_METHODS.ETHER_WITHDRAWN,
            contract: contractAddress,
            user: userAddress,
            txhash: hash,
            amount: realAmount
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        // WITHDRAW tokens
        let hash;
        const realAmount = fromNormalTokenToBase(amount, decimals).toString();
        if (providerType === PRIVATE_KEY) {
          const txRaw = {
            from: userAddress,
            to: contractAddress,
            gasPrice,
            gasLimit: 100000, // TODO to constant
            data: contractInstance.withdrawToken.getData(
              tokenAddress,
              realAmount
            )
          };
          hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
        } else {
          hash = yield call(
            promisify(contractInstance.withdrawToken.bind(contractInstance)),
            tokenAddress,
            realAmount,
            {
              from: userAddress,
              gasPrice
            }
          );
        }
        yield put(newTransaction(hash));
        console.log('Withdraw token: ', hash);

        try {
          yield call(API.newTX, {
            method: NEW_TX_METHODS.TOKEN_WITHDRAWN,
            contract: contractAddress,
            user: userAddress,
            txhash: hash,
            amount: realAmount,
            token: tokenAddress
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (action.type === TRANSFER) {
      if (isEtherActive) {
        const realAmount = fromEtherToWei(amount).toString();
        let hash;
        if (providerType === PRIVATE_KEY) {
          const txRaw = {
            value: realAmount,
            from: userAddress,
            to: transferToAddress,
            gasPrice,
            gasLimit: 21000
          };
          hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
        } else {
          hash = yield call(
            promisify(web3.eth.sendTransaction.bind(web3.eth)),
            {
              value: realAmount,
              from: userAddress,
              to: transferToAddress
            }
          );
        }
        yield put(newTransaction(hash));
        console.log('Transfer ether: ', hash);

      } else {
        // TRANSFER tokens
        const realAmount = fromNormalTokenToBase(amount, decimals).toString();
        let hash;
        if (providerType === PRIVATE_KEY) {
          const txRaw = {
            from: userAddress,
            to: tokenAddress,
            gasPrice,
            gasLimit: 100000,
            data: tokenInstance.transfer.getData(transferToAddress, realAmount)
          };
          hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
        } else {
          hash = yield call(
            promisify(tokenInstance.transfer.bind(tokenInstance)),
            transferToAddress,
            realAmount,
            {
              from: userAddress,
              gasPrice
            }
          );
        }
        yield put(newTransaction(hash));
        console.log('Transfer token: ', hash);
        yield updateBalances();
      }
    }
  } catch (e) {
    yield handleError(e);
  }
}

export default function*() {
  yield takeEvery(GET_BALANCES, getBalances);
  yield takeEvery([DEPOSIT, WITHDRAW, TRANSFER], moveFunds);
}
