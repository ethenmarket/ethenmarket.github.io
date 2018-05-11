import axios from "axios";
import { isValidAddress } from "../utils";

const BASE_URL_API = "/api/";

const request = axios.create({
  baseURL: BASE_URL_API
});

export const NEW_TX_METHODS = {
  TRADE: "trade",
  ETHER_DEPOSITED: "etherDeposited",
  ETHER_WITHDRAWN: "etherWithdrawn",
  TOKEN_DEPOSITED: "tokenDeposited",
  TOKEN_WITHDRAWN: "tokenWithdrawn"
};

const API = {
  getOrdersByContract(contract, token) {
    return request(`orders/list`, { params: { contract, token } });
  },
  getTokenList() {
    return request("tokens/list");
  },
  getToken(token) {
    let params;
    if (isValidAddress(token)) {
      params = { address: token };
    } else {
      params = { link: token };
    }
    return request(`tokens/get`, { params });
  },
  getContracts() {
    return request('contracts');
  },
  /**
   * @param {address} props.contract
   * @param {number} props.trade 2=buy, 3=sell
   * @param {address} props.token
   * @param {string} props.price Цена за 1e18 базовых токенов
   * @param {string} props.amount Количество базовых токенов
   * @param {number} props.expire timestamp
   * @param {string} props.signature Подпись ордера (hex-65)
   */
  placeOrder({ contract, buy, token, price, amount, expire, signature, user, takeOnly = false }) {
    return request.post("orders/place", {
      contract,
      buy,
      token,
      price,
      amount,
      expire,
      signature,
      user,
      takeOnly
    });
  },
  cancelOrder({ contract, token, nonce, user }) {
    return request.post("orders/cancel", {
      contract,
      token,
      nonce,
      user
    });
  },
  cancelTrade({ contract, user, tradeNonce, orders }) {
    return request.post("orders/cancel/trade", { contract, user, tradeNonce, orders });
  },
  getOwnOrders({ contract, user }) {
    return request("orders/list", { params: { contract, owner: user } });
  },
  getTokenOrders({ contract, token }) {
    return request("orders/list", { params: { contract, token } });
  },
  getChartData({ contract, token }) {
    return request("sticks", { params: { contract, token } });
  },
  newTX({ method, txhash, contract, user, amount, token, nonce, value, orders }) {
    if (method === NEW_TX_METHODS.TRADE) {
      return request.post("tx/new", {
        orders,
        contract,
        user,
        txhash,
        method,
        nonce
      });
    }

    if (
      method === NEW_TX_METHODS.ETHER_WITHDRAWN ||
      method === NEW_TX_METHODS.ETHER_DEPOSITED
    ) {
      return request.post("tx/new", {
        contract,
        user,
        txhash,
        method,
        value
      });
    }

    if (
      method === NEW_TX_METHODS.TOKEN_DEPOSITED ||
      method === NEW_TX_METHODS.TOKEN_WITHDRAWN
    ) {
      return request.post("tx/new", {
        contract,
        user,
        txhash,
        method,
        amount,
        token
      });
    }
    return Promise.reject();
  },
  addNewToken({ address, user }) {
    return request.post("tokens/new", { address, user });
  },

  getBalances(contract, user) {
    return request("balances", { params: { contract, user } });
  },

  auth({ contract, user, signature, newHash }) {
    return request.post('auth', { contract, user, signature, newHash });
  },

  getAuthed() {
    return request('auth');
  },
  getNonce(contract, user) {
    return request('orders/newnonce', { params: { contract, user } });
  },
  star({ token, favorite, user, contract }) {
    return request.post('tokens/star', { token, favorite, user, contract });
  },
  createOrder({ contract, user, buy, nonce, token, price, amount, expire, newHash, signature }) {
    return request.post('orders/create', { contract, user, buy, nonce, token, price, amount, expire, newHash, signature });
  },
  getTokenTrades({ contract, token }) {
    return request('trades', { params: { contract, token } } );
  },
  getUserTrades({ contract, user }) {
    return request('trades', { params: { contract, user } } );
  },
  sendStat({ referrer, hrefBefore, hrefAfter }, user) {
    return request.post('stats', { user, referrer, hrefBefore, hrefAfter });
  },
  sendEmail(email) {
    return request.post('email', { email });
  },
  getLanguage(lang) {
    return import(`../langs/${lang}.json`);
  }
};

export default API;
