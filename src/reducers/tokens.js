import produce from 'immer';
import { createSelector } from 'reselect';
import { createAction } from './util';
import { tokenNameCompare, from10e18BaseTokensPriceTo1Normal, fromWeiToEther, cropAddress } from '../utils';
import { defaultToken, STATES } from './actions';
import definedLinks from '../tokenlinks.json';

export const UPDATE_TOKENS_LIST = 'tokens/UPDATE_LIST';
export const updateTokensList = createAction(UPDATE_TOKENS_LIST);
export const ADD_NEW_TOKEN = 'tokens/ADD_NEW_TOKEN';
export const addNewToken = createAction(ADD_NEW_TOKEN);
export const ADD_CURRENT_TOKEN = 'tokens/ADD_CURRENT_TOKEN';
export const addCurrentToken = createAction(ADD_CURRENT_TOKEN);
export const SET_CURRENT_TOKEN = 'currentToken/SET_CURRENT_TOKEN';
export const setCurrentToken = createAction(SET_CURRENT_TOKEN);
export const SET_FAVORITE = 'tokens/SET_FAVORITE';
export const setFavorite = createAction(SET_FAVORITE);

const initialState = {
  map: {},
  onlyTrusted: false,
  state: STATES.loading,
  current: {
    address: ''
  }
};

export default (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case UPDATE_TOKENS_LIST: {
      action.payload.forEach(token => {
        token.decimals = token.decimals || defaultToken.decimals;
        draft.map[token.address] = token;
      });
      draft.state = STATES.defined;
      break;
    }
    case ADD_CURRENT_TOKEN:
    case ADD_NEW_TOKEN: {
      const token = action.payload;
      draft.map[token.address] = token;
      break;
    }
    case SET_CURRENT_TOKEN: {
      // sets address if it looks valid
      const { token = '' } = action.payload;
      let address;
      const addressesList = Object.keys(draft.map);
      const tokenAddr = definedLinks.tokens[token] || addressesList.find(addr => draft.map[addr].link === token);
      if (tokenAddr) {
        address = tokenAddr;
      } else if (token.length === 42) {
        address = token;
      }
      draft.current.address = address;
      break;
    }
    case SET_FAVORITE: {
      const { token, favorite } = action.payload;
      draft.map[token].favorite = favorite;
      break;
    }
  }
});

const tokenSort = (a, b) => {
  const aName = a.symbol || a.address;
  const bName = b.symbol || b.address;
  if (a.favorite && b.favorite) return tokenNameCompare(aName, bName);
  if (a.favorite) return -1;
  if (b.favorite) return 1;
  if (a.verified && b.verified) return tokenNameCompare(aName, bName);
  if (a.verified) return -1;
  if (b.verified) return 1;
  return tokenNameCompare(aName, bName);
};

export const getTokens = createSelector(
  state => state.tokens.map,
  state => state.tokens.onlyTrusted,
  (map, onlyTrusted) => {
    const list = Object.keys(map);
    const tokens = list
      .map(addr => map[addr])
      .filter(t => onlyTrusted ? t.verified : true);
    return tokens.map(t => {
      const price = fromWeiToEther(from10e18BaseTokensPriceTo1Normal(t.price.toString(10), t.decimals)).toString();
      const volume = fromWeiToEther(t.volume24h.toString(10)).toString();
      return {
        ...t,
        price,
        volume,
        displayName: t.name || cropAddress(t.address),
        change: t.change24h.toFixed(2)
      };
    }).sort(tokenSort);
  }
);


export const getCurrentToken = createSelector(
  state => state.tokens.current.address,
  state => state.tokens.map,
  (address, tokens) => tokens[address] || defaultToken
);
