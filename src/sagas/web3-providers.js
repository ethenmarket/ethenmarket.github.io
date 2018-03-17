import { takeEvery, put, call, fork } from 'redux-saga/effects';
import { promisify } from 'es6-promisify';
import handleError from './errors';
import user from './user';
import getWeb3, { LEDGER, METAMASK } from '../API/web3';
import { CHECK_AVAILABLE_WEB3_PROVIDERS } from '../reducers/actions';
import { updateProviders } from '../reducers/web3-provider';
import { showInfo } from '../reducers/notifications';

/* eslint-disable import/no-named-as-default-member */
function* checkProviders() {
  try {
    const ledger = yield call(getWeb3[LEDGER]);
    const isMetamaskActive = getWeb3[METAMASK]();

    if (isMetamaskActive) {
      const getNetworkId = promisify(isMetamaskActive.version.getNetwork.bind(isMetamaskActive.version));
      const netWorkId = yield call(getNetworkId);
      if (netWorkId !== '1') yield put(showInfo({
        title: 'Metamask',
        message: 'You are using test network'
      }));
      if (!isMetamaskActive.eth.accounts[0]) {
        yield put(showInfo({
          title: 'Metamask',
          message: 'Your wallet are locked. Please unlock it and refresh the page'
        }));
      }
    }

    let isLedgerActive = null;
    const checkLedger = promisify(ledger.eth.getAccounts.bind(ledger.eth));
    try {
      isLedgerActive = yield call(checkLedger);
    } catch (e) {
      console.error(e);
    }
    yield put(updateProviders({
      [METAMASK]: !!isMetamaskActive,
      [LEDGER]: !!isLedgerActive
    }));
    // providers changed, needs update all data
    yield fork(user);
  } catch (e) {
    yield handleError(e);
  }
}

export default function* () {
  yield takeEvery(CHECK_AVAILABLE_WEB3_PROVIDERS, checkProviders);
}