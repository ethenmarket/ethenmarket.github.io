import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import createSagaMiddleware from 'redux-saga';
import { connectRoutes } from 'redux-first-router';
import queryString from 'query-string';
import createHistory from 'history/createBrowserHistory';
import { localeReducer as locale } from 'react-localize-redux';

import rootSaga from '../sagas';
import reducers from '../reducers';
import routes, { onBeforeChange } from '../routes';

const history = createHistory();

export const reduxHistory = connectRoutes(history, routes, {
  initialDispatch: false,
  querySerializer: queryString,
  onBeforeChange
});

let isHistoryInitialized = false;
export const historyInitialDispatch = () => {
  if (isHistoryInitialized) return;
  reduxHistory.initialDispatch();
  isHistoryInitialized = true;
};

const rootReducer = combineReducers({
  ...reducers,
  location: reduxHistory.reducer,
  locale
});

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options if needed
});

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
  reduxHistory.middleware,
  sagaMiddleware
);

export default (initState = {}) => {
  const store = createStore(rootReducer, initState, composeEnhancers(
    reduxHistory.enhancer,
    middleware
  ));

  sagaMiddleware.run(rootSaga);
  return store;
};
