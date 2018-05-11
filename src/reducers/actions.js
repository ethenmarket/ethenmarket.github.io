import { createAction } from './util';

export const STATES = {
  loading: 'loading',
  error: 'error',
  defined: 'value_exist',
  initial: 'not_fetched'
};

export const defaultToken = {
  decimals: 0,
  __default__: true // needs to define is real token recieved or it is just mock
};

export const isLoading = state => state === STATES.loading;
export const isError = state => state === STATES.error;
export const isInitial = state => state === STATES.initial;
export const isDefined = state => state === STATES.defined;

export const CREATE_ORDER = 'request/CREATE_ORDER';
export const createOrder = createAction(CREATE_ORDER);

export const GET_OWN_ORDERS = 'request/GET_OWN_ORDERS';
export const getOwnOrders = createAction(GET_OWN_ORDERS);

export const GET_CHART_DATA = 'request/GET_CHART_DATA';
export const getChartData = createAction(GET_CHART_DATA);

export const GET_BALANCES = 'request/GET_BALANCES';
export const getBalances = createAction(GET_BALANCES);

export const AUTHENTICATE = 'request/AUTHENTICATE';
export const auth = createAction(AUTHENTICATE);

export const GET_AUTHENTICATED = 'request/GET_AUTHENTICATED';
export const getAuthenticated = createAction(GET_AUTHENTICATED);

export const DEPOSIT = 'fund/DEPOSIT';
export const deposit = createAction(DEPOSIT);

export const WITHDRAW = 'fund/WITHDRAW';
export const withdraw = createAction(WITHDRAW);

export const TRANSFER = 'fund/TRANSFER';
export const transfer = createAction(TRANSFER);

export const ADD_NEW_TOKEN = 'request/ADD_NEW_TOKEN';
export const addNewToken = createAction(ADD_NEW_TOKEN);

export const GET_TOKENS_LIST = 'request/GET_TOKENS_LIST';
export const getTokensList = createAction(GET_TOKENS_LIST);

export const CURRENT_TOKEN_CHANGED = 'tokens/CURRENT_TOKEN_CHANGED';
export const currentTokenChanged = createAction(CURRENT_TOKEN_CHANGED);

export const CHECK_AVAILABLE_WEB3_PROVIDERS = 'web3-provider/CHECK_AVAILABLE_WEB3_PROVIDERS';
export const checkWeb3Providers = createAction(CHECK_AVAILABLE_WEB3_PROVIDERS);

export const GET_TOKEN_ORDERS = 'request/GET_TOKEN_ORDERS';
export const getTokenOrders = createAction(GET_TOKEN_ORDERS);

export const CANCEL_ORDER = 'request/CANCEL_ORDER';
export const cancelOrder = createAction(CANCEL_ORDER);

export const GET_TOKEN_TRADES = 'request/GET_TOKEN_TRADES';
export const getTokenTrades = createAction(GET_TOKEN_TRADES);

export const GET_OWN_TRADES = 'request/GET_OWN_TRADES';
export const getOwnTrades = createAction(GET_OWN_TRADES);

export const SET_FAVORITE = 'request/SET_FAVORITE';
export const setFavorite = createAction(SET_FAVORITE);

export const GET_CONTRACTS = 'request/GET_CONTRACTS';
export const getContracts = createAction(GET_CONTRACTS);

export const GET_FAVORITES = 'request/GET_FAVORITES';
export const getFavorites = createAction(GET_FAVORITES);

export const SEND_EMAIL = 'requset/GET_FAVORITES';
export const sendEmail = createAction(SEND_EMAIL);

export const GET_CURRENT_TOKEN = 'requset/GET_CURRENT_TOKEN';
export const getCurrentToken = createAction(GET_CURRENT_TOKEN);

export const SELECT_LANGUAGE = "translate/SELECT_LANGUAGE";
export const selectLanguage = createAction(SELECT_LANGUAGE);
