import { takeEvery, put, call } from "redux-saga/effects";

import API from '../API';
import { GET_CONTRACTS } from "../reducers/actions";
import { updateContracts } from "../reducers/contract";
import handleError from './errors';

function* getContracts() {
  try {
    const { data } = yield call(API.getContracts);
    const list = data.contracts.map(c => c.address);
    const current = data.contracts.find(c => c.default).address;

    yield put(updateContracts({ list, current }));
  } catch (e) {
    yield handleError(e);
  }
}

export default function*() {
  yield takeEvery(GET_CONTRACTS, getContracts);
}