import { put } from 'redux-saga/effects';
import { getFirtsSentence } from '../utils';
import { ERRORS_ACTIONS } from '../reducers/notifications';


export default function* handleError(e) {
  console.error(e);
  try {
    if (e.response) {
      const message = e.config ? `${e.config.url} ${e.response.status}` : e.response.status;
      yield put(ERRORS_ACTIONS.networkError(message));
    } else {
      let message = e.message || e;
      const isMetamask = (/metamask/i).test(message);
      message = isMetamask ? getFirtsSentence(message) : message;
      yield put(ERRORS_ACTIONS.runtimeError(message));
    }
  } catch(er) {
    yield handleError(er);
  }
};