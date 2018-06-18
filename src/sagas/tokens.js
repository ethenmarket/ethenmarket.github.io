import { takeEvery, put, call, select } from "redux-saga/effects";
import { getTranslate } from "react-localize-redux";

import { getBalances } from "./balances";
import handleError from "./errors";
import API from "../API";
import {
  updateTokensList,
  addNewToken,
  addCurrentToken,
  setCurrentToken,
  setFavorite,
  SET_CURRENT_TOKEN,
  getCurrentToken
} from "../reducers/tokens";
import {
  GET_TOKENS_LIST,
  ADD_NEW_TOKEN,
  SET_FAVORITE,
  GET_CURRENT_TOKEN
} from "../reducers/actions";
import { closeModal } from "../reducers/modal";
import definedLinks from '../tokenlinks.json';


const updateSEOInfo = (token) => {
  if (token.__default__) return;
  let tokenName;
  if (token.name && token.symbol) {
    tokenName = `${token.name} (${token.symbol})`;
  } else  {
    tokenName = token.name || token.symbol || token.address;
  }
  document.title = `Ethen – Decentralized ERC20 Exchange – ${tokenName}`;
  const description = `Buy and sell ${tokenName} on Ethen. The only decentralized exchange with bulk and partial order execution at best price. Taker fee: 0.25%, Maker fee: 0%. Placing orders is free.`;
  const meta = document.head.querySelector('meta[name="description"]');
  meta.content = description;
};

function* fetchNewTokenData(action) {
  if (action.payload.onlyURL) return;
  const currentTokenAddress = yield select(state => state.tokens.current.address);
  if (!currentTokenAddress) return;
  yield getBalances({});

  const currentToken = yield select(getCurrentToken);
  updateSEOInfo(currentToken);
}

function* getCurrentTokenInfo() {
  try {
    const currentAddress = yield select(state => state.tokens.current.address);
    const { data } = yield call(API.getToken, currentAddress);
    yield put(addCurrentToken(data));
    updateSEOInfo(data);
  } catch (e) {
    yield handleError(e);
  }
}

function* getTokens() {
  try {
    const { data } = yield call(API.getTokenList);
    const currentAddress = yield select(state => state.tokens.current.address);
    const current = data.tokens.find(t => t.address === currentAddress);
    yield put(updateTokensList(data.tokens.map(t => ({
      ...t,
      price: t.price,
      volume24h: t.volume24h
    }))));
    const tokenPath = yield select(state => state.location.payload.token); // get info from url
    let newTokenPath;
    let onlyURL = null;
    if (!current) {
      const realToken = data.tokens.find(
        token => token.address.toLowerCase() === tokenPath ||
        token.link === tokenPath
      );

      if (!realToken) {
        newTokenPath = definedLinks.tokens[definedLinks.default] || data.tokens[0].address;
      }
    } else if (current.link !== tokenPath) { // redirect from address to link
      newTokenPath = current.link;
      onlyURL = true;
    }
    if (newTokenPath) {
      if (current) updateSEOInfo(current);
      yield put(setCurrentToken({ token: newTokenPath, onlyURL }));
    };
  } catch (e) {
    yield handleError(e);
  }
}

function* handleAddNewToken(action) {
  try {
    const { address: enteredAddress, decimals } = action.payload;
    const address = enteredAddress.trim().toLowerCase();
    yield put(addNewToken({ address, decimals }));
    yield put(closeModal());
    yield put(setCurrentToken({ token: address }));
  } catch (e) {
    if (e.response) {
      const translate = yield select(state => getTranslate(state.locale));
      switch (e.response.status) {
        case 409:
          e.message = translate("TOKEN_EXIST");
          e.response = null;
          break;
        case 400:
          e.message = translate("NOT_ERC20");
          e.response = null;
          break;
      }
    }
    yield handleError(e);
  }
}

function* setFavoriteSaga(action) {
  try {
    yield put(setFavorite(action.payload));
    const { token, favorite } = action.payload;
    const user = yield select(state => state.user.address);
    const contract = yield select(state => state.contract.current);
    yield call(API.star, { user, contract, token, favorite });
  } catch (e) {
    const { token, favorite } = action.payload;
    yield put(setFavorite({
      token,
      favorite: !favorite
    }));
    yield handleError(e);
  }
}

export default function*() {
  yield takeEvery(GET_TOKENS_LIST, getTokens);
  yield takeEvery(GET_CURRENT_TOKEN, getCurrentTokenInfo);
  yield takeEvery(ADD_NEW_TOKEN, handleAddNewToken);
  yield takeEvery(SET_FAVORITE, setFavoriteSaga);
  yield takeEvery(SET_CURRENT_TOKEN, fetchNewTokenData);
}
