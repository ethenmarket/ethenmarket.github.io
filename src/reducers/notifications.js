import produce from 'immer';
import { getLinkToTransaction } from "../utils";
import { createAction } from './util';

export const NETWORK_ERROR = 'error/NETWORK';
export const networkError = createAction(NETWORK_ERROR);
export const RUNTIME_ERROR = 'error/RUNTIME';
export const runtimeError = createAction(RUNTIME_ERROR);
export const CUSTOM_ERROR = 'error/CUSTOM_ERROR';
export const CLEAR_ERROR = 'error/CLEAR';
export const clearError = createAction(CLEAR_ERROR);

export const ERRORS_ACTIONS = {
  clearError,
  runtimeError,
  networkError
};


export const CLEAR_INFO = 'info/CLEAR';
export const clearInfo = createAction(CLEAR_INFO);
export const SHOW_INFO = 'info/SHOW_INFO';
export const showInfo = createAction(SHOW_INFO);


const initState = {
  error: {
    title: null,
    message: null,
    type: null,
    nonce: 0
  },
  info: {
    title: null,
    message: null,
    type: null,
    nonce: 0
  }
};

const getPrefix = string => string.slice(0, string.indexOf('/'));

export default (state = initState, action) => produce(state, draft => {
  const prefix = getPrefix(action.type);
  if (prefix === 'error') draft.error.nonce += 1;
  if (prefix === 'info') draft.info.nonce += 1;
  switch (action.type) {
    case NETWORK_ERROR: {
      const code = action.payload;
      draft.error.title = 'Network error';
      draft.error.message = `Error ${code}`;
      break;
    }
    case RUNTIME_ERROR: {
      draft.error.title = 'Error';
      draft.error.message = action.payload;
      break;
    }
    case CUSTOM_ERROR: {
      draft.error.message = action.payload;
      break;
    }
    case CLEAR_ERROR: {
      draft.error.message = null;
      break;
    }
    case CLEAR_INFO: {
      draft.info.message = null;
      break;
    }
    case SHOW_INFO: {
      const { nonce } = draft.info;
      draft.info = action.payload;
      draft.info.nonce = nonce;
      break;
    }
  }
});

export const newTransaction = tx => showInfo({
  title: 'New transaction',
  children: `<a target="_blank" href="${getLinkToTransaction(tx)}">${tx}</a>`
});