import produce from 'immer';
import { createAction } from './util';
import { fromWeiToEther } from '../utils';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

const initState = {
  address: zeroAddress,
  balance: '0',
  gasPrice: '',
  locale: null
};

export const USER_UPDATE_ACCOUNT = 'user/UPDATE_ACCOUNT';
export const updateUserAccount = createAction(USER_UPDATE_ACCOUNT);
export const USER_UPDATE_BALANCE = 'user/USER_UPDATE_BALANCE';
export const updateUserBalance = createAction(USER_UPDATE_BALANCE);
export const USER_IS_UNDEFINED = 'user/USER_IS_UNDEFINED';
export const userIsUndefined = createAction(USER_IS_UNDEFINED);
export const SET_GAS_PRICE = 'user/SET_GAS_PRICE';
export const setGasPrice = createAction(SET_GAS_PRICE);

export const INIT_LANGUAGE = "user/INIT_LANGUAGE";
export const initLanguage = createAction(INIT_LANGUAGE);

export default (state = initState, action) => produce(state, (draft) => {
  switch(action.type) {
    case USER_UPDATE_ACCOUNT: {
      draft.address = action.payload.address;
      break;
    }
    case USER_UPDATE_BALANCE: {
      draft.balance = fromWeiToEther(action.payload.balance).toString();
      break;
    }
    case SET_GAS_PRICE: {
      draft.gasPrice = action.payload;
      break;
    }
    case INIT_LANGUAGE: {
      draft.locale = 'ready';
    }
  }
});