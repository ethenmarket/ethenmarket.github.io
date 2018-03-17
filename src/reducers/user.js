import produce from 'immer';
import { createAction } from './util';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

const initState = {
  address: zeroAddress,
  balance: '0',
  gasPrice: '12000000000'
};

export const USER_UPDATE_ACCOUNT = 'user/UPDATE_ACCOUNT';
export const updateUserAccount = createAction(USER_UPDATE_ACCOUNT);

export const SET_GAS_PRICE = 'user/SET_GAS_PRICE';
export const setGasPrice = createAction(SET_GAS_PRICE);

export default (state = initState, action) => produce(state, (draft) => {
  switch(action.type) {
    case USER_UPDATE_ACCOUNT: {
      draft.address = action.payload.address;
      draft.balance = action.payload.balance;
      break;
    }
    case SET_GAS_PRICE: {
      draft.gasPrice = action.payload;
      break;
    }
  }
});