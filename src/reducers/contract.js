import produce from 'immer';
import { createAction } from './util';

export const UPDATE_CONTRACTS = 'contract/UPDATE_CONTRACTS';
export const updateContracts = createAction(UPDATE_CONTRACTS);


const initState = {
  current: '',
  list: []
};

export default (state = initState, action) => produce(state, (draft) => {
  switch(action.type) {
    case UPDATE_CONTRACTS: {
      draft.list = action.payload.list;
      draft.current = action.payload.current;
      break;
    }
  }
});