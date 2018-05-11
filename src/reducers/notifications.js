import produce from 'immer';
import { getLinkToTransaction } from "../utils";
import { createAction } from './util';

export const ERROR = 'error/RUNTIME';
export const showError = createAction(ERROR);
export const CLEAR_ERROR = 'error/CLEAR';
export const clearError = createAction(CLEAR_ERROR);

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
    case ERROR: {
      if (typeof action.payload === 'object') {
        const { nonce } = draft.error;
        draft.error = action.payload;
        draft.error.nonce = nonce;
        break;
      }
      draft.error.title = 'Error';
      draft.error.message = action.payload;
      draft.error.children = null;
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
  autoDismiss: 0,
  translate: {
    title: true
  },
  title: 'NEW_TX',
  children: `<a style="word-break: break-all" target="_blank" href="${getLinkToTransaction(tx)}">${tx}</a>`
});