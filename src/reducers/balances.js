import produce from 'immer';
import { createSelector } from 'reselect';
import BigNumber from 'bignumber.js';
import { createAction } from './util';
import { fromBaseTokensToNormal, fromWeiToEther, from10e18BaseTokensPriceTo1Normal, countChangedColor } from '../utils';
import { STATES, GET_BALANCES, WITHDRAW, defaultToken } from './actions';
import { USER_IS_UNDEFINED, USER_UPDATE_BALANCE } from './user';

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
export const WAIT_TX_RESPONSE = 'balances/WAIT_TX_RESPONSE';
export const waitTxResponse = createAction(WAIT_TX_RESPONSE);
export const TX_RESPONSE_ERROR = 'balances/TX_RESPONSE_ERROR';
export const txResponseError = createAction(TX_RESPONSE_ERROR);
export const TX_RESPONSE_SUCCESS = 'balances/TX_RESPONSE_SUCCESS';
export const txResponseSuccess = createAction(TX_RESPONSE_SUCCESS);

export const NOT_ENOUGH_FUNDS_HIGHLIGHT = 'balances/NOT_ENOUGH_FUNDS_HIGHLIGHT';
export const notEnoughFundsHighlight = createAction(NOT_ENOUGH_FUNDS_HIGHLIGHT);
export const CLEAR_HIGHLIGHT = 'balances/CLEAR_HIGHLIGHT';
export const clearHighlight = createAction(CLEAR_HIGHLIGHT);


export const MOVE_FUND = 'balances/MOVE_FUND';
export const moveFund = createAction(MOVE_FUND);

export const getDefaultBalance = address => ({
  txs: [],
  address,
  bid: '',
  ethen: {
    current: '0',
    losses: '0',
    gains: '0'
  },
  wallet: '0',
  highlight: {}
});

export const initState = {
  isEtherActive: false,
  gasPrice: 2000000000,
  tokens: {
    // '0xd260a308b5607ab6d48aad6b8710d972e14b98da': {
    //   txs: [],
    //   address: '0xd260a308b5607ab6d48aad6b8710d972e14b98da',
    //   wallet: BigNumber('1e18').times(10000).toString(),
    //   ethen: {
    //     current: BigNumber('1e18').times(100).toString(),
    //    gains: '0',
    //     losses: '0'
    //   }
    // }
  },
  ether: {
    txs: [],
    wallet: '0',
    ethen: {
      current: '0',
      gains: '0',
      losses: '0'
    }
  },
  state: STATES.loading,
  errorMessage: null,
  txState: STATES.defined
};

const notEnoughFundsHighlightColor = 'rgb(255,52,52)';

export const userIsUndefErrorMessage = 'BALANCE_WALLET_UNDEF';

export default (state = initState, action) => produce(state, (draft) => {
  switch (action.type) {
    case USER_UPDATE_BALANCE: {
      draft.ether.wallet = action.payload.balance;
      break;
    }
    case UPDATE_BALANCES: {
      const { tokens, ether } = action.payload;
      draft.tokens = {...draft.tokens, ...tokens};
      draft.ether = {...draft.ether, ...ether};
      draft.state = STATES.defined;
      break;
    }
    case UPDATE_TOKEN_WALLET_BALANCE: {
      const { token, amount } = action.payload;

      if (!draft.tokens[token]) {
        draft.tokens[token] = getDefaultBalance(token);
      }
      if (draft.tokens[token].wallet !== amount) {
        if (!draft.tokens[token].highlight) draft.tokens[token].highlight = {};
        draft.tokens[token].highlight.wallet = countChangedColor;
      }
      draft.tokens[token].wallet = amount;
      break;
    }
    case TOGGLE_MOVE_FUNDS_MODE: {
      draft.isEtherActive = !state.isEtherActive;
      break;
    }
    case GET_BALANCES: {
      if (action.payload && action.payload.init) {
        draft.state = STATES.loading;
      }
      break;
    }
    case BALANCES_LOADING_ERROR: {
      draft.state = STATES.error;
      break;
    }
    case USER_IS_UNDEFINED: {
      draft.state = STATES.error;
      draft.errorMessage = userIsUndefErrorMessage;
      break;
    }
    case WAIT_TX_RESPONSE: {
      draft.txState = STATES.loading;
      break;
    }
    case TX_RESPONSE_ERROR: {
      draft.txState = STATES.error;
      break;
    }
    case TX_RESPONSE_SUCCESS: {
      draft.txState = STATES.defined;
      break;
    }
    case NOT_ENOUGH_FUNDS_HIGHLIGHT: {
      const { token, wallet } = action.payload;
      if (!token) { // it is ether
        if (!draft.ether.highlight) draft.ether.highlight = {};
        draft.ether.highlight[wallet] = notEnoughFundsHighlightColor;
      } else {
        if (!draft.tokens[token].highlight) draft.tokens[token].highlight = {};
        draft.tokens[token].highlight[wallet] = notEnoughFundsHighlightColor;
      }
      break;
    }
    case MOVE_FUND: {
      const { token, tx, method, amount } = action.payload;

      const balance = token ? draft.tokens[token] : draft.ether;
      balance.txs = [tx];
      if (method === WITHDRAW) {
        balance.ethen.losses = BigNumber(balance.ethen.losses).plus(amount).toString();
      }
      break;
    }
    case CLEAR_HIGHLIGHT: {
      const { token, wallet, all } = action.payload;

      if (all) {
        draft.ether.highlight = {};
        Object.keys(state.tokens).forEach(address => {
          draft.tokens[address].highlight = {};
        });
        break;
      }

      if (!token) { // it is ether
        if (draft.ether.highlight) {
          delete draft.ether.highlight[wallet];
        }
      } else if (draft.tokens[token].highlight) {
        delete draft.tokens[token].highlight[wallet];
      }
      break;
    }
  }
});


const isNotEmptyBalances = balance => BigNumber(balance.ethen.current).minus(balance.ethen.losses).gt(0) || BigNumber(balance.wallet).gt(0);

const getBalanceOfToken = (token, tokenBalance) => {
  const tokenWallet = fromBaseTokensToNormal(BigNumber(tokenBalance.wallet), token.decimals);
  const tokenEthen = fromBaseTokensToNormal(BigNumber(tokenBalance.ethen.current).minus(tokenBalance.ethen.losses), token.decimals);
  const tokenTotal = tokenWallet.plus(tokenEthen);
  const tokenTx = tokenBalance.txs && tokenBalance.txs[0];
  let bid;
  let est;
  if (tokenBalance.bid){
    bid = fromWeiToEther(from10e18BaseTokensPriceTo1Normal(tokenBalance.bid, token.decimals));
    est = bid.times(tokenTotal).toString();
    bid = bid.toString();
  }
  return ({
    tx: tokenTx,
    highlight: tokenBalance.highlight,
    name: token.symbol || token.address,
    address: token.address,
    wallet: tokenWallet.toString(),
    ethen: tokenEthen.toString(),
    total: tokenTotal.toString(),
    bid,
    est
  });
};

export const getBalances = createSelector(
  state => state.balances.ether,
  state => state.balances.tokens,
  state => state.tokens.map,
  state => state.tokens.current.address,
  (balancesEther, balancesTokens, tokens, currentToken) => {
    const balances = [];
    const mainBalances = [];
    const etherWallet = fromWeiToEther(BigNumber(balancesEther.wallet));
    const etherEthen = fromWeiToEther(BigNumber(balancesEther.ethen.current).minus(balancesEther.ethen.losses));
    const etherTotal = etherWallet.plus(etherEthen);
    const etherTx = balancesEther.txs && balancesEther.txs[0];

    mainBalances.push({
      tx: etherTx,
      highlight: balancesEther.highlight,
      name: 'ETH',
      real: true,
      wallet: etherWallet.toString(),
      ethen: etherEthen.toString(),
      total: etherTotal.toString()
    });
    if (tokens[currentToken] && balancesTokens[currentToken]) {
      const curentTokenBalance = getBalanceOfToken(tokens[currentToken], balancesTokens[currentToken]);
      mainBalances.push(curentTokenBalance);
    }

    Object.keys(balancesTokens)
      .filter(tokenAddr => isNotEmptyBalances(balancesTokens[tokenAddr]))
      .forEach(tokenAddr => {
        const token = tokens[tokenAddr];
        if (!token) return;
        const tokenBalance = balancesTokens[tokenAddr];
        const balance = getBalanceOfToken(token, tokenBalance);
        balances.push(balance);
      });
    return {
      balances,
      mainBalances
    };
  }
);

export const getEtherBalance = createSelector(
  state => state.balances.ether,
  (ether) => {
    const etherEthen = fromWeiToEther(BigNumber(ether.ethen.current).minus(ether.ethen.losses));
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
    const tokenEthen = fromBaseTokensToNormal(BigNumber(tokenBalance.ethen.current).minus(tokenBalance.ethen.losses), token.decimals);
    return tokenEthen;
  }
);