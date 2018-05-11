import produce from 'immer';
import { createAction } from './util';
import { STATES } from './actions';

const initState = {
  current: '',
  privateKey: '',
  state: STATES.loading
};

export const SELECT_CURRENT_PROVIDER = 'web3-provider/SELECT_CURRENT_PROVIDER';
export const selectProvider = createAction(SELECT_CURRENT_PROVIDER);
export const SET_CURRENT_PROVIDER = 'web3-provider/SET_CURRENT_PROVIDER';
export const setProvider = createAction(SET_CURRENT_PROVIDER);
export const SET_PRIVATE_KEY = 'web3-provider/SET_PRIVATE_KEY';
export const setPrivateKey = createAction(SET_PRIVATE_KEY);
export const PROVIDER_LOADING = 'web3-provider/PROVIDER_LOADING';
export const providerLoading = createAction(PROVIDER_LOADING);

export default (state = initState, action) => produce(state, (draft) => {
  switch (action.type) {
    case SET_CURRENT_PROVIDER: {
      const { provider } = action.payload;
      draft.state = STATES.defined;
      if (action.payload[provider]) {
        draft.current = provider;
      }
      break;
    }

    case PROVIDER_LOADING: {
      draft.state = STATES.loading;
      break;
    }

    case SET_PRIVATE_KEY: {
      draft.privateKey = action.payload;
    }
  }
});