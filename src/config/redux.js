import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import createSagaMiddleware from 'redux-saga';
import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createHashHistory';

import rootSaga from '../sagas';
import reducers from '../reducers';
import routes from '../routes';

const history = createHistory();

const reduxHistory = connectRoutes(history, routes);

const rootReducer = combineReducers({
  ...reducers,
  location: reduxHistory.reducer
});

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options if needed
});

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
  reduxHistory.middleware,
  sagaMiddleware
);

export default () => {
  const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
    reduxHistory.enhancer,
    middleware
  ));

  sagaMiddleware.run(rootSaga);

  return store;
};
