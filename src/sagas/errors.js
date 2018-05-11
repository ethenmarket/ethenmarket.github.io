import { put, select} from 'redux-saga/effects';
import { getTranslate } from "react-localize-redux";
import { getFirtsSentence, fromWeiToEther } from '../utils';
import { showError } from '../reducers/notifications';


// It should be sync with server/lib/errors
const SERVER_ERRORS = {
  UNAUTHORIZED_ERROR: "unauthorized",
  ORDER_SMALL_ERROR: "order small",
  INSUFFICIENT_ERROR: "insufficient"
};

export default function* handleError(e) {
  const translate = yield select(state => getTranslate(state.locale));
  console.error(e);
  try {
    if (e.response) {
      let message;
      const errMessage = e.response.data && e.response.data.error;
      switch (errMessage) {
        case SERVER_ERRORS.UNAUTHORIZED_ERROR: {
          const { config } = e;
          message = translate('AUTH_NEEDS');
          if (`${config.baseURL}auth` === config.url) message = translate('AUTH_FAILED');
          break;
        }
        case SERVER_ERRORS.ORDER_SMALL_ERROR: {
          message = translate("ORDER_SIZE_SMALL", { size: fromWeiToEther(e.response.data.minValue)});
          break;
        }
        case SERVER_ERRORS.INSUFFICIENT_ERROR: {
          message = translate("INSUFFICIENT");
          break;
        }
        default: message = e.config ? `${e.config.url} ${e.response.status}` : e.response.status;
      }
      yield put(showError(message));
    } else {
      let message = e.message || e;
      const isMetamask = (/metamask/i).test(message);
      message = isMetamask ? getFirtsSentence(message) : message;
      yield put(showError(message));
    }
  } catch(er) {
    yield handleError(er);
  }
};