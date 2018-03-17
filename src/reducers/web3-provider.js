import produce from 'immer';
import { LEDGER, METAMASK } from '../API/web3';
import { createAction } from './util';

const initState = {
  available: { PRIVATE_KEY: true },
  current: '',
  privateKey: ''
};

export const UPDATE_AVAILABLE_PROVIDERS = 'web3-provider/UPDATE_AVAILABLE_PROVIDERS';
export const updateProviders = createAction(UPDATE_AVAILABLE_PROVIDERS);
export const SELECT_CURRENT_PROVIDER = 'web3-provider/SELECT_CURRENT_PROVIDER';
export const selectProvider = createAction(SELECT_CURRENT_PROVIDER);
export const SET_PRIVATE_KEY = 'web3-provider/SET_PRIVATE_KEY';
export const setPrivateKey = createAction(SET_PRIVATE_KEY);


export default (state = initState, action) => produce(state, (draft) => {
  switch (action.type) {
    case UPDATE_AVAILABLE_PROVIDERS: {
      let current = '';
      if (action.payload[METAMASK]) current = METAMASK;
      if (action.payload[LEDGER]) current = LEDGER;
      draft.available = action.payload;
      draft.current = current;
      break;
    }
    case SELECT_CURRENT_PROVIDER: {
      draft.current = action.payload;
      break;
    }

    case SET_PRIVATE_KEY: {
      draft.privateKey = action.payload;
    }
  }
});