import { all, put, take, fork, select } from 'redux-saga/effects';
import tokens from './tokens';
import balances from './balances';
import web3Providers from './web3-providers';
import contract from './contract';
import handleError from './errors';
import user from './user';
import lang from './lang';

import { getTokensList, getCurrentToken } from '../reducers/actions';
import { INIT_LANGUAGE } from '../reducers/user';
import { UPDATE_CONTRACTS } from '../reducers/contract';
import { historyInitialDispatch } from '../config/redux';

import { METAMASK } from '../API/web3';
import { selectProvider } from '../reducers/web3-provider';

function* initLoading() {
  historyInitialDispatch();
  yield put(getCurrentToken());
  yield put(getTokensList());

  const locale = yield select(state => state.user.locale);
  if (!locale) {
    yield take(INIT_LANGUAGE); // wait language because needs to show notifications
  }
  yield put(selectProvider({ provider: METAMASK, init: true }));
}

export default function* rootSaga() {
  try {
    yield fork(contract);
    yield take(UPDATE_CONTRACTS);
    yield all([
      tokens(),
      balances(),
      user(),
      web3Providers(),
      lang(),
      initLoading()
    ]);
  } catch (e) {
    yield handleError(e);
  }
}