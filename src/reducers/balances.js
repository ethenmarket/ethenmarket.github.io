import produce from 'immer';
import { createSelector } from 'reselect';
import BigNumber from 'bignumber.js';
import { createAction } from './util';
import { fromBaseTokensToNormal, fromWeiToEther } from '../utils';
import { STATES, GET_BALANCES } from './actions';

export const ADD_WITHDRAW_DATA = 'balances/ADD_WITHDRAW_DATA';
export const addWithdrawData = createAction(ADD_WITHDRAW_DATA);
export const UPDATE_BALANCES = 'balances/UPDATE_BALANCES';
export const updateBalances = createAction(UPDATE_BALANCES);
export const TOGGLE_MOVE_FUNDS_MODE = 'balances/TOGGLE_MOVE_FUNDS_MODE';
export const toggleMoveFundsMode = createAction(TOGGLE_MOVE_FUNDS_MODE);
export const BALANCES_LOADING_ERROR = 'balances/LOADING_ERROR';
export const balancesLoadingError = createAction(BALANCES_LOADING_ERROR);
export const UPDATE_TOKEN_WALLET_BALANCE = 'balances/UPDATE_TOKEN_WALLET_BALANCE';
export const updateTokenWalletBalance = createAction(UPDATE_TOKEN_WALLET_BALANCE);
export const WAIT_APPROVING = 'balances/WAIT_APPROVING';
export const waitApproving = createAction(WAIT_APPROVING);
export const APPROVING_ERROR = 'balances/APPROVING_ERROR';
export const approvingError = createAction(APPROVING_ERROR);
export const APPROVING_SUCCESS = 'balances/APPROVING_SUCCESS';
export const approvingSuccess = createAction(APPROVING_SUCCESS);

const initState = {
  isEtherActive: false,
  gasPrice: 2000000000,
  tokens: {
    // '0xd260a308b5607ab6d48aad6b8710d972e14b98da': {
    //   address: '0xd260a308b5607ab6d48aad6b8710d972e14b98da',
    //   wallet: BigNumber('1e18').times(10000).toString(),
    //   ethen: '0'
    // }
  },
  ether: {
    wallet: '0',
    ethen: '0'
  },
  state: STATES.defined,
  depositApprovingState: STATES.defined
};

export default (state = initState, action) => produce(state, (draft) => {
  switch (action.type) {
    case UPDATE_BALANCES: {
      draft.tokens = action.payload.tokens;
      draft.ether = action.payload.ether;
      draft.state = STATES.defined;
      break;
    }
    case UPDATE_TOKEN_WALLET_BALANCE: {
      draft.tokens[action.payload.token].wallet = action.payload.amount;
      break;
    }
    case TOGGLE_MOVE_FUNDS_MODE: {
      draft.isEtherActive = !state.isEtherActive;
      break;
    }
    case GET_BALANCES: {
      draft.state = STATES.loading;
      break;
    }
    case BALANCES_LOADING_ERROR: {
      draft.state = STATES.error;
      break;
    }
    case WAIT_APPROVING: {
      draft.depositApprovingState = STATES.loading;
      break;
    }
    case APPROVING_ERROR: {
      draft.depositApprovingState = STATES.error;
      break;
    }
    case APPROVING_SUCCESS: {
      draft.depositApprovingState = STATES.defined;
      break;
    }
  }
});


const isNotEmptyBalances = balance => BigNumber(balance.ethen).gt(0) || BigNumber(balance.wallet).gt(0);

export const getBalances = createSelector(
  state => state.balances.ether,
  state => state.balances.tokens,
  state => state.tokens.map,
  (balancesEther, balancesTokens, tokens) => {
    const result = [];
    const etherWallet = fromWeiToEther(BigNumber(balancesEther.wallet));
    const etherEthen = fromWeiToEther(BigNumber(balancesEther.ethen));
    const etherTotal = etherWallet.plus(etherEthen);
    result.push({
      name: 'ETH',
      real: true,
      wallet: etherWallet.toString(),
      ethen: etherEthen.toString(),
      total: etherTotal.toString()
    });
    Object.keys(balancesTokens)
      .filter(tokenAddr => isNotEmptyBalances(balancesTokens[tokenAddr]))
      .forEach(tokenAddr => {

        const token = tokens[tokenAddr] || { decimals: 18 };
        const tokenBalance = balancesTokens[tokenAddr];
        const tokenWallet = fromBaseTokensToNormal(BigNumber(tokenBalance.wallet), token.decimals);
        const tokenEthen = fromBaseTokensToNormal(BigNumber(tokenBalance.ethen), token.decimals);
        const tokenTotal = tokenWallet.plus(tokenEthen);
        result.push({
          name: token.symbol || token.address,
          wallet: tokenWallet.toString(),
          ethen: tokenEthen.toString(),
          total: tokenTotal.toString()
        });
      });
    return result;
  }
);

export const getEtherBalance = createSelector(
  state => state.balances.ether,
  (ether) => {
    const etherEthen = fromWeiToEther(BigNumber(ether.ethen));
    return etherEthen;
  }
);

export const getCurrentTokenBalance = createSelector(
  state => state.balances.tokens,
  state => state.tokens.current.address,
  state => state.tokens.map,
  (balances, address, tokens) => {
    const token = tokens[address];
    const tokenBalance = balances[address];
    if (!tokenBalance || !token) return '';
    const tokenEthen = fromBaseTokensToNormal(BigNumber(tokenBalance.ethen), token.decimals);
    return tokenEthen;
  }
);