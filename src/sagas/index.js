import { all } from 'redux-saga/effects';
import tokens from './tokens';
import balances from './balances';
import web3Providers from './web3-providers';
import handleError from './errors';

export default function* rootSaga() {
  try {
    yield all([
      tokens(),
      balances(),
      web3Providers()
    ]);
  } catch (e) {
    yield handleError(e);
  }
}