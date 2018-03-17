import axios from "axios";

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
  getTokenList(all = false) {
    return request("tokens/list", { params: { all } });
  },
  newTX({ method, txhash, contract, user, amount, token, nonce }) {
    if (method === NEW_TX_METHODS.TRADE) {
      return request.post("tx/new", {
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
        amount
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
  }
};

export default API;
