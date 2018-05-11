import { redirect } from 'redux-first-router';
import { SET_CURRENT_TOKEN } from './reducers/tokens';
import { zeroAddress } from './reducers/user';
import { isValidAddress } from './utils';
import definedLinks from './tokenlinks.json';
import API from './API';

const Routes = {
  [SET_CURRENT_TOKEN]: {
    path: '/(token)?/:token?',
    fromPath: (path) => path.length === 40 ? `0x${path.toLowerCase()}` : path,
    toPath: value => value.length === 42 ? value.slice(2) : value
  }
};

const buildUrl = (path, search) => search ? `${location.origin}${path}?${search}` : `${location.origin}${path}`; // eslint-disable-line

let isUserSettedInterval;
let events = [];
const numberOfAttempt = 10;
const INDEX_PAGE_MOCK = '___INDEX___';
export const onBeforeChange = (dispatch, getState, { action: origAction }) => {
  // redirects
  if (origAction.type === SET_CURRENT_TOKEN) {
    const origToken = origAction.payload.token;
    let tokenPath = origToken === undefined ? INDEX_PAGE_MOCK : origToken;

    if (isValidAddress(tokenPath)) { // if not valid it will be handle in sagas/tokens - getTokens
      tokenPath = tokenPath.toLowerCase();
      const { tokens } = getState();
      const link = tokens.map[tokenPath] && tokens.map[tokenPath].link;
      if (link) {
        const action = redirect({ type: SET_CURRENT_TOKEN, payload: { token: link }});
        dispatch(action);
      } else if (origAction.payload[0] === 'token' || origToken === undefined) {
        const action = redirect({ type: SET_CURRENT_TOKEN, payload: { token: tokenPath }}); // redirect without /token prefix
        dispatch(action);
      }
    } else if (tokenPath === INDEX_PAGE_MOCK) {
      const action = redirect({
        type: SET_CURRENT_TOKEN,
        payload: { token: definedLinks.default || 'index' }
      });
      dispatch(action);
    }
  }

  // STATS
  if (origAction.meta && !origAction.meta.location.prev.pathname) return;
  const { prev, current } = origAction.meta.location;
  const hrefBefore = buildUrl(prev.pathname, prev.search);
  const hrefAfter = buildUrl(current.pathname, current.search);
  const { referrer } = document;
  let i = 0;
  events.push({
    referrer: i === 0 ? referrer : null,
    hrefAfter,
    hrefBefore
  });
  isUserSettedInterval = setInterval(() => {
    const { user: { address } } = getState();
    i += 1;
    if (address !== zeroAddress || i >= numberOfAttempt) {
      clearInterval(isUserSettedInterval);
      events.forEach(e => API.sendStat(e, address));
      events = [];
    }
  }, 500);
};

export default Routes;