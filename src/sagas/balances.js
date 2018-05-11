import { takeEvery, put, call, select, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import { promisify } from "es6-promisify";
import BigNumber from "bignumber.js";
import { getTranslate } from "react-localize-redux";
import handleError from "./errors";

import API, { NEW_TX_METHODS } from "../API";
import getWeb3, {
  getERC20Contract,
  getContract,
  PRIVATE_KEY,
  sendRawTransaction
} from "../API/web3";

import { waitFor, resolveRace } from './utils';

import { GET_BALANCES, DEPOSIT, WITHDRAW, TRANSFER, getBalances as getBalancesAction, isDefined } from "../reducers/actions";
import {
  updateBalances,
  balancesLoadingError,
  updateTokenWalletBalance,
  waitTxResponse,
  txResponseError,
  txResponseSuccess,
  moveFund as moveFundAction,
  getDefaultBalance
} from "../reducers/balances";
import { getCurrentToken, UPDATE_TOKENS_LIST } from "../reducers/tokens";
import { zeroAddress, USER_UPDATE_ACCOUNT } from "../reducers/user";

import { fromEtherToWei, fromNormalTokenToBase, getBalancesWithDiff } from "../utils";
import { newTransaction } from "../reducers/notifications";

import { waitForSigning } from './auth';

const WITHDRAW_ETHER_GAS_LIMIT = 120000;
const WITHDRAW_TOKEN_GAS_LIMIT = 120000;
const DEPOSIT_ETHER_GAS_LIMIT = 120000;
const APPROVE_TOKEN_GAS_LIMIT = 120000;
const DEPOSIT_TOKEN_GAS_LIMIT = 120000;
const TRANSFER_ETHER_GAS_LIMIT = 120000;
const TRANSFER_TOKEN_GAS_LIMIT = 120000;

function getTokenBalance(web3, userAddress, tokenAddress) {
  const addr = userAddress.substring(2);
  const contractData = `0x70a08231000000000000000000000000${addr}`;
  const ethCall = promisify(web3.eth.call.bind(web3.eth));
  return ethCall({ to: tokenAddress, data: contractData }).then(
    val => (val === "0x" ? "0" : BigNumber(val).toString())
  );
}

function* updateTokensBalances(web3, userAddress, tokensAddresses) {
  try {
    const balances = [];
    const concurentRequestCount = 3;
    while (tokensAddresses.length) {
      const forRequest = tokensAddresses.slice(0, concurentRequestCount);
      tokensAddresses = tokensAddresses.slice(concurentRequestCount);
      const results = yield call(
        [Promise, Promise.all],
        forRequest.map(address => getTokenBalance(web3, userAddress, address))
      );
      for(let i = 0; i < results.length; i += 1) {
        balances.push({
          amount: results[i],
          token: forRequest[i]
        });
      }
    }
    return balances;
  } catch (e) {
    yield handleError(e);
    return [];
  }
}

export function* getCurrentTokenWalletBalance() {
  try {
    const providerType = yield select(state => state.web3Provider.current);
    if (!providerType) return;
    const web3 = yield call(getWeb3[providerType]);
    const currentToken = yield select(state => state.tokens.current.address);
    const userAddress = yield select(state => state.user.address);
    const tokenWalletBalance = yield call(
      getTokenBalance,
      web3,
      userAddress,
      currentToken
    );
    yield put(
      updateTokenWalletBalance({
        token: currentToken,
        amount: tokenWalletBalance
      })
    );
  } catch (e) {
    yield handleError(e);
  }
}

function* getBalances(action) {
  try {
    const init = action.payload && action.payload.init;
    const userAddress = yield select(state => state.user.address);
    const contract = yield select(state => state.contract.current);
    const { data } = yield call(API.getBalances, contract, userAddress);
    const tokens = yield select(state => state.tokens.addressesList);
    const currentToken = yield select(state => state.tokens.current.address);
    const providerType = yield select(state => state.web3Provider.current);
    const web3 = yield call(getWeb3[providerType]);
    const etherBalance = yield call(
      promisify(web3.eth.getBalance.bind(web3.eth)),
      userAddress
    );
    let newBalances = {
      ether: {
        wallet: etherBalance.toString(),
        ethen: {
          current: data.ether.current,
          losses: data.ether.losses,
          gains: data.ether.gains
        },
        txs: data.ether.txhashes
      },
      tokens: {}
    };
    data.tokens.forEach(ethenToken => {
      const { current, gains, losses, address, bid, txhashes: txs } = ethenToken;
      newBalances.tokens[ethenToken.address] = {
        address,
        bid,
        txs,
        ethen: { current, gains, losses },
        wallet: '0'
      };
    });
    const oldBalances = yield select(state => state.balances);

    if (!init) {
      newBalances = getBalancesWithDiff(oldBalances, newBalances);
    }


    const walletBalances = yield updateTokensBalances(
      web3,
      userAddress,
      [currentToken]
    );
    walletBalances.forEach(wallet => { // merge wallet balances to server response
      if (newBalances.tokens[wallet.token]) {
        newBalances.tokens[wallet.token].wallet = wallet.amount;
      } else {
        const newTokenBalance = getDefaultBalance(wallet.token);
        newTokenBalance.wallet = wallet.amount;
        newBalances.tokens[wallet.token] = newTokenBalance;
      }
    });

    yield resolveRace(
      function* condition() {
        const tokensState = yield select(state => state.tokens.state);
        return isDefined(tokensState);
      },
      [UPDATE_TOKENS_LIST],
      function* finalAction() {
        yield put(updateBalances(newBalances));
      }
    );
  } catch (e) {
    yield put(balancesLoadingError());
    yield handleError(e);
  }
}

let init = true;
function* waitWhileDataForBalancesRequestIsReady() {
  yield waitFor([USER_UPDATE_ACCOUNT], function* callback() {
    yield put(getBalancesAction({ init }));
    init = false;
  });
}

function* moveFunds(action) {
  try {
    const userAddress = yield select(state => state.user.address);
    const translate = yield select(state => getTranslate(state.locale));

    if (!userAddress || userAddress === zeroAddress)
      throw new Error(
        translate("UNLOCK_WALLET_ERROR")
      );

    const providerType = yield select(state => state.web3Provider.current);
    const web3 = yield call(getWeb3[providerType]);
    // const gasPrice = yield select(state => state.balances.gasPrice);
    const gasPrice = (yield call(promisify(web3.eth.getGasPrice.bind(web3.eth)))).valueOf();
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
            gasLimit: DEPOSIT_ETHER_GAS_LIMIT, // TODO change to constant
            value: realValue,
            gasPrice,
            data: contractInstance.depositEther.getData()
          };
          yield waitForSigning(function* sign() {
            hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
          });
        } else {
          // DEPOSIT ether metamask or ledger
          yield waitForSigning(function* sign() {
            hash = yield call(
              promisify(contractInstance.depositEther.bind(contractInstance)),
              {
                from: userAddress,
                value: realValue,
                gas: DEPOSIT_ETHER_GAS_LIMIT,
                gasPrice
              }
            );
          });
        }
        yield put(newTransaction(hash));
        console.log('Deposit ether: ', hash);
        yield put(moveFundAction({
          amount: realValue,
          tx: hash,
          method: DEPOSIT
        }));
        try {
          yield call(API.newTX, {
            method: NEW_TX_METHODS.ETHER_DEPOSITED,
            contract: contractAddress,
            user: userAddress,
            txhash: hash,
            value: realValue
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
            yield put(waitTxResponse());
            if (providerType === PRIVATE_KEY) {
              const txRaw = {
                from: userAddress,
                to: tokenAddress,
                gasPrice,
                gasLimit: APPROVE_TOKEN_GAS_LIMIT,
                data: tokenInstance.approve.getData(contractAddress, realAmount)
              };
              yield waitForSigning(function* sign() {
                approveHash = yield call(
                  sendRawTransaction,
                  web3,
                  txRaw,
                  privateKey
                );
              });
            } else {
              yield waitForSigning(function* sign() {
                approveHash = yield call(
                  promisify(tokenInstance.approve.bind(tokenInstance)),
                  contractAddress,
                  BigNumber(realAmount)
                    .times(10)
                    .toString(),
                  {
                    from: userAddress,
                    gas: APPROVE_TOKEN_GAS_LIMIT,
                    gasPrice
                  }
                );
              });
            }
            yield put(newTransaction(approveHash));
            while (!receipt || receipt === wasApproved) {
              yield delay(800);
              receipt = yield call(getTransactionReceipt, approveHash);
            }
          }

          if (parseInt(receipt.status, 16) === 1 || receipt === wasApproved) {
            if (receipt !== wasApproved) yield put(txResponseSuccess());
            let depositHash;
            if (providerType === PRIVATE_KEY) {
              const txRaw = {
                from: userAddress,
                to: contractAddress,
                gasPrice,
                gasLimit: DEPOSIT_TOKEN_GAS_LIMIT,
                data: contractInstance.depositToken.getData(
                  tokenAddress,
                  realAmount
                )
              };
              yield waitForSigning(function* sign() {
                depositHash = yield call(
                  sendRawTransaction,
                  web3,
                  txRaw,
                  privateKey
                );
              });
            } else {
              yield waitForSigning(function* sign() {
                depositHash = yield call(
                  promisify(contractInstance.depositToken.bind(contractInstance)),
                  tokenAddress,
                  realAmount,
                  {
                    from: userAddress,
                    gasPrice,
                    gas: DEPOSIT_TOKEN_GAS_LIMIT
                  }
                );
              });
              console.log(depositHash);
            }

            yield put(newTransaction(depositHash));
            console.log('Deposit token', depositHash);
            yield put(moveFundAction({
              token: tokenAddress,
              amount: realAmount,
              tx: depositHash,
              method: DEPOSIT
            }));
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
            throw new Error(translate("TX_FAILED", { tx_hash: approveHash }));
          }
        } catch (e) {
          yield put(txResponseError());
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
            gasLimit: WITHDRAW_ETHER_GAS_LIMIT,
            data: contractInstance.withdrawEther.getData(realAmount)
          };
          yield waitForSigning(function* sign() {
            hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
          });
        } else {
          yield waitForSigning(function* sign() {
            hash = yield call(
              promisify(contractInstance.withdrawEther.bind(contractInstance)),
              realAmount,
              {
                from: userAddress,
                gas: WITHDRAW_ETHER_GAS_LIMIT,
                gasPrice
              }
            );
          });
        }
        yield put(newTransaction(hash));
        console.log('Withdraw ether: ', hash);
        yield put(moveFundAction({
          amount: realAmount,
          tx: hash,
          method: WITHDRAW
        }));
        try {
          yield call(API.newTX, {
            method: NEW_TX_METHODS.ETHER_WITHDRAWN,
            contract: contractAddress,
            user: userAddress,
            txhash: hash,
            value: realAmount
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
            gasLimit: WITHDRAW_TOKEN_GAS_LIMIT,
            data: contractInstance.withdrawToken.getData(
              tokenAddress,
              realAmount
            )
          };
          yield waitForSigning(function* sign() {
            hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
          });
        } else {
          yield waitForSigning(function* sign() {
            hash = yield call(
              promisify(contractInstance.withdrawToken.bind(contractInstance)),
              tokenAddress,
              realAmount,
              {
                from: userAddress,
                gas: WITHDRAW_TOKEN_GAS_LIMIT,
                gasPrice
              }
            );
          });
        }
        yield put(newTransaction(hash));
        console.log('Withdraw token: ', hash);
        yield put(moveFundAction({
          token: tokenAddress,
          amount: realAmount,
          tx: hash,
          method: WITHDRAW
        }));
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
            gasLimit: TRANSFER_ETHER_GAS_LIMIT
          };
          yield waitForSigning(function* sign() {
            hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
          });
        } else {
          yield waitForSigning(function* sign() {
            hash = yield call(
              promisify(web3.eth.sendTransaction.bind(web3.eth)),
              {
                value: realAmount,
                from: userAddress,
                gas: TRANSFER_ETHER_GAS_LIMIT,
                to: transferToAddress
              }
            );
          });
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
            gasLimit: TRANSFER_TOKEN_GAS_LIMIT,
            data: tokenInstance.transfer.getData(transferToAddress, realAmount)
          };
          yield waitForSigning(function* sign() {
            hash = yield call(sendRawTransaction, web3, txRaw, privateKey);
          });
        } else {
          yield waitForSigning(function* sign() {
            hash = yield call(
              promisify(tokenInstance.transfer.bind(tokenInstance)),
              transferToAddress,
              realAmount,
              {
                from: userAddress,
                gas: TRANSFER_TOKEN_GAS_LIMIT,
                gasPrice
              }
            );
          });
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
  yield fork(waitWhileDataForBalancesRequestIsReady);
}
