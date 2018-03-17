import { takeEvery, put, call, select } from 'redux-saga/effects';

import handleError from './errors';
import { getCurrentTokenWalletBalance } from './balances';
import API from '../API';
import { updateTokensList, addNewToken, setCurrentToken } from '../reducers/tokens';
import { GET_TOKENS_LIST, CURRENT_TOKEN_CHANGED, ADD_NEW_TOKEN } from '../reducers/actions';


function* getTokens(action) {
  try {
    const { data } = yield call(API.getTokenList, action.payload);
    data.tokens.sort((a, b) => {
      if (a.name === '') return 1;
      if (b.name === '') return -1;
      return a.name > b.name ? 1 : -1;
    });
    const current = yield select(state => state.tokens.current.address);
    if (!current || !data.tokens.find(token => token.address === current)) {
      yield put(setCurrentToken({ address: data.tokens[0].address }));
    }
    yield put(updateTokensList(data.tokens));
  } catch (e) {
    yield handleError(e);
  }
}

function* handleCurentTokenChanged(action) {
  try {
    const address = action.payload;
    yield put(setCurrentToken({ address }));
  } catch(e) {
    yield handleError(e);
  }
}

function* handleAddNewToken(action) {
  try {
    const { decimals, address } = action.payload;
    yield put(addNewToken({ address, decimals }));
    yield put(setCurrentToken({ address }));
    yield getCurrentTokenWalletBalance();
  } catch (e) {
    yield handleError(e);
  }
}

export default function* () {
  yield takeEvery(GET_TOKENS_LIST, getTokens);
  yield takeEvery(ADD_NEW_TOKEN, handleAddNewToken);
  yield takeEvery(CURRENT_TOKEN_CHANGED, handleCurentTokenChanged);
}