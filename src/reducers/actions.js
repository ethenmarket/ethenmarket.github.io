import { createAction } from './util';

export const STATES = {
  loading: 'loading',
  error: 'error',
  defined: 'value_exist'
};

export const isLoading = state => state === STATES.loading;
export const isError = state => state === STATES.error;

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

export const DEPOSIT = 'fund/DEPOSIT';
export const deposit = createAction(DEPOSIT);

export const WITHDRAW = 'fund/WITHDRAW';
export const withdraw = createAction(WITHDRAW);

export const TRANSFER = 'fund/TRANSFER';
export const transfer = createAction(TRANSFER);

export const ADD_NEW_TOKEN = 'request/ADD_NEW_TOKEN';
export const addNewToken = createAction(ADD_NEW_TOKEN);

export const GET_TOKENS_LIST = 'request/GET_LIST';
export const getTokensList = createAction(GET_TOKENS_LIST);

export const CURRENT_TOKEN_CHANGED = 'tokens/CURRENT_TOKEN_CHANGED';
export const currentTokenChanged = createAction(CURRENT_TOKEN_CHANGED);

export const CHECK_AVAILABLE_WEB3_PROVIDERS = 'web3-provider/CHECK_AVAILABLE_WEB3_PROVIDERS';
export const checkWeb3Providers = createAction(CHECK_AVAILABLE_WEB3_PROVIDERS);

export const GET_TOKEN_ORDERS = 'request/GET_TOKEN_ORDERS';
export const getTokenOrders = createAction(GET_TOKEN_ORDERS);

export const CANCEL_ORDER = 'request/CANCEL_ORDER';
export const cancelOrder = createAction(CANCEL_ORDER);