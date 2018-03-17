import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
  getTokensList,
  checkWeb3Providers
} from './reducers/actions';

import './index.css';
import App from './components/App';

import createStore from './config/redux';
import { openModal, MODAL_TYPES } from './reducers/modal';

const store = createStore();

store.dispatch(checkWeb3Providers());
store.dispatch(getTokensList());

const isFirstTime = !localStorage.getItem('visited');
localStorage.setItem('visited', true);

if (isFirstTime) store.dispatch(openModal({ type: MODAL_TYPES.USER_GUIDE }));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

