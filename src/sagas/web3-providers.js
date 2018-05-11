import { takeEvery, put, call, select } from 'redux-saga/effects';
import { promisify } from 'es6-promisify';
import { getTranslate } from "react-localize-redux";

import { showInfo, showError } from '../reducers/notifications';
import handleError from './errors';
import getWeb3, { LEDGER, METAMASK, PRIVATE_KEY } from '../API/web3';
import { setProvider, SELECT_CURRENT_PROVIDER, providerLoading } from '../reducers/web3-provider';
import { userIsUndefined } from '../reducers/user';


function* showMetamaskWalletInfo(metamask) {
  const translate = yield select(state => getTranslate(state.locale));
  const web3 = metamask;
  const getNetworkId = promisify(web3.version.getNetwork.bind(web3.version));
  const netWorkId = yield call(getNetworkId);

  if (netWorkId !== '1') yield put(showInfo({
    title: 'MetaMask',
    message: translate('TESTNET_WARN')
  }));
  if (!web3.eth.accounts[0]) {
    yield put(userIsUndefined());
    yield put(showInfo({
      title: 'MetaMask',
      message: translate('WALLET_LOCKED')
    }));
  }
}

/* eslint-disable import/no-named-as-default-member */
function* checkProviders(action) {
  let { provider = METAMASK, init = false } = action.payload; // eslint-disable-line
  const translate = yield select(state => getTranslate(state.locale));
  yield put(providerLoading());
  try {
    let isLedgerActive = null;
    let isMetamaskActive = null;

    if (init) {
      isMetamaskActive = yield call(getWeb3[METAMASK], true);
      if (isMetamaskActive) {
        provider = METAMASK;
        yield showMetamaskWalletInfo(isMetamaskActive);
      } else {
        const ledger = yield call(getWeb3[LEDGER], true);
        const checkLedger = promisify(ledger.eth.getAccounts.bind(ledger.eth));
        try {
          isLedgerActive = yield call(checkLedger);
          provider = LEDGER;
        } catch (e) {
          const pk = yield select(state => state.web3Provider.privateKey);
          if (!pk) {
            yield put(showError({
              title: translate("WALLET_NOR_RECOGNIZED"),
              children: translate("INSTALL_INSTRUCTION")
            }));
            yield put(userIsUndefined());
          }
        }
      }
    } else {
      if (provider === LEDGER) {
        const ledger = yield call(getWeb3[LEDGER], true);
        const checkLedger = promisify(ledger.eth.getAccounts.bind(ledger.eth));
        try {
          isLedgerActive = yield call(checkLedger);
        } catch (e) {
          yield put(showError({
            title: translate("LEDGER_NOT_RECOGNIZED"),
            children: translate("LEDGER_INSTRUCTION")
          }));
          console.error(e);
        }
      }

      if (provider === METAMASK) {
        isMetamaskActive = yield call(getWeb3[METAMASK], true);
        if (isMetamaskActive) {
          yield showMetamaskWalletInfo(isMetamaskActive);
        } else {
          yield put(showError({
            title: translate("NO_METAMASK"),
            children: translate("METAMASK_INSTRUCTION")
          }));
        }
      }
    }

    yield put(setProvider({
      [METAMASK]: !!isMetamaskActive,
      [LEDGER]: !!isLedgerActive,
      [PRIVATE_KEY]: true,
      provider
    }));
  } catch (e) {
    yield handleError(e);
  }
}

export default function* () {
  yield takeEvery(SELECT_CURRENT_PROVIDER, checkProviders);
}