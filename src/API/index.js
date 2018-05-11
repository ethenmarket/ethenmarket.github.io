import axios from "axios";
import { isValidAddress } from "../utils";

import mockAPI from './mock';

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
  getTokenList: mockAPI.getTokenList,
  getToken: mockAPI.getToken,
  getContracts() {
    return request('contracts');
  },
  getLanguage(lang) {
    return import(`../langs/${lang}.json`);
  }
};

export default API;
