import produce from 'immer';
import { createSelector } from 'reselect';
import { createAction } from './util';
import { tokenNameCompare } from '../utils';

export const UPDATE_TOKENS_LIST = 'tokens/UPDATE_LIST';
export const updateTokensList = createAction(UPDATE_TOKENS_LIST);
export const ADD_NEW_TOKEN = 'tokens/ADD_NEW_TOKEN';
export const addNewToken = createAction(ADD_NEW_TOKEN);
export const SET_CURRENT_TOKEN = 'currentToken/SET_CURRENT_TOKEN';
export const setCurrentToken = createAction(SET_CURRENT_TOKEN);

const initialState = {
  addressesList: [],
  map: {
    '0xd260a308b5607ab6d48aad6b8710d972e14b98da': {
      decimals: 18
    }
  },
  onlyTrusted: false,
  current: {
    address: ''
  }
};

export default (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case UPDATE_TOKENS_LIST: {
      action.payload.forEach(token => {
        token.decimals = token.decimals || 18;
        draft.map[token.address] = token;
      });
      draft.addressesList = Object.keys(draft.map);
      break;
    }
    case ADD_NEW_TOKEN: {
      const token = action.payload;
      draft.map[token.address] = token;
      draft.addressesList.push(token.address);
      break;
    }
    case SET_CURRENT_TOKEN: {
      draft.current.address = action.payload.address;
      break;
    }
  }
});

export const getTokens = createSelector(
  state => state.tokens.addressesList,
  state => state.tokens.map,
  state => state.tokens.onlyTrusted,
  (list, map, onlyTrusted) => {
    const tokens = list.map(addr => map[addr]).sort((a, b) => {
      const aName = a.symbol || a.address;
      const bName = b.symbol || b.address;
      return tokenNameCompare(aName, bName);
    });
    return onlyTrusted ? tokens.filter(t => t.verified) : tokens;
  }
);


export const getCurrentToken = createSelector(
  state => state.tokens.current.address,
  state => state.tokens.map,
  (address, tokens) => tokens[address] || { decimals: 18 }
);