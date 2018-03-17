import produce from 'immer';
import { createAction } from './util';

export const CLOSE_MODAL = 'modal/CLOSE_MODAL';
export const closeModal = createAction(CLOSE_MODAL);
export const OPEN_MODAL = 'modal/OPEN_MODAL';
export const openModal = createAction(OPEN_MODAL);

export const MODAL_TYPES = {
  ADD_NEW_TOKEN: 'ADD_NEW_TOKEN',
  SET_PRIVATE_KEY: 'SET_PRIVATE_KEY',
  SET_GAS_PRICE: 'SET_GAS_PRICE',
  INFO: 'INFO'
};

const initState = {
  type: '',
  data: {
    title: ''
  }
};

export default (state = initState, action) => produce(state, (draft) => {
  switch (action.type) {
    case CLOSE_MODAL: {
      draft.type = '';
      break;
    }
    case OPEN_MODAL: {
      draft.type = action.payload.type;
      draft.data = action.payload.data;
      break;
    }
  }
});