import tokenList from './tokens-list.json';

const makeResponse = data => () => Promise.resolve({ data });

export default {
  getTokenList: makeResponse(tokenList),
  getToken(token) {
    const res = tokenList.tokens.find(t => t.address === `${token}` || t.link === token);
    if (res) return makeResponse(res)();
    return Promise.reject(new Error("Undefined token"));
  }
};