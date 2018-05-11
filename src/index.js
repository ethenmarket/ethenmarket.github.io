import deepmerge from 'deepmerge';
import React from 'react';
import ReactDOM from 'react-dom';
import { addTranslationForLanguage, initialize as initializeLangs, setActiveLanguage } from 'react-localize-redux';
import { Provider } from 'react-redux';
import API from './API';
import App from './components/App';
import createStore from './config/redux';
import './index.css';
import ENG from './langs/en.json';
import { getContracts } from './reducers/actions';
import { initState as balancesInitState } from './reducers/balances';
import { updateContracts } from './reducers/contract';
import { MODAL_TYPES, openModal } from './reducers/modal';
import { initLanguage } from './reducers/user';


const isEtherActive = localStorage.getItem('isEtherActive') === 'true';
balancesInitState.isEtherActive = isEtherActive;

const store = createStore({ balances: balancesInitState });
window.onbeforeunload = () => {
  const state = store.getState();
  localStorage.setItem('isEtherActive', state.balances.isEtherActive);
};

if (process.env.REACT_APP_CONTRACT) {
  store.dispatch(updateContracts({ list: [], current: process.env.REACT_APP_CONTRACT }));
} else {
  store.dispatch(getContracts()); // load contracts from server
}


const isFirstTime = !localStorage.getItem('visited');
localStorage.setItem('visited', true);
if (isFirstTime) store.dispatch(openModal({ type: MODAL_TYPES.EMAIL }));

// translation
const languages = [
  { name: "English", code: "en" },
  { name: "한국어", code: "ko" },
  { name: "汉语", code: "zh-cn" },
  { name: "Español", code: "es" },
  { name: "漢語", code: "zh-tw" }
];

const savedLang = localStorage.getItem("language");

const localizeOptions = {
  defaultLanguage: 'en',
  showMissingTranslationMsg: false,
  renderInnerHtml: false
};

if (!process.env !== 'production') {
  Object.assign(localizeOptions, {
    missingTranslationCallback: console.warn.bind(console, "Missed localization")
  });
}

store.dispatch(initializeLangs(languages, localizeOptions));
store.dispatch(addTranslationForLanguage(ENG, 'en'));

const initApp = () => {
  store.dispatch(initLanguage());
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
};

// downdload and set last language
if (languages.find(l => l.code === savedLang) && savedLang !== "en") {
  API.getLanguage(savedLang)
    .then((translations) => {
      store.dispatch(addTranslationForLanguage(deepmerge(ENG, translations), savedLang));
      store.dispatch(setActiveLanguage(savedLang));
      initApp();
    });
} else {
  initApp();
}
