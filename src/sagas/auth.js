import { put } from "redux-saga/effects";

import {
  MODAL_TYPES,
  openModal,
  closeModal
} from "../reducers/modal";

export function* waitForSigning (sign) { // eslint-disable-line
  try {
    yield put(openModal({
      type: MODAL_TYPES.SIGNING
    }));
    yield sign();
    yield put(closeModal());
  } catch (e) {
    yield put(closeModal());
    throw e;
  }
}
