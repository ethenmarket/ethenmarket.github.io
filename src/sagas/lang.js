import deepmerge from 'deepmerge';
import { addTranslationForLanguage, setActiveLanguage } from 'react-localize-redux';
import { call, put, takeEvery } from 'redux-saga/effects';
import API from '../API';
import ENG from '../langs/en.json';
import { SELECT_LANGUAGE } from '../reducers/actions';
import handleError from './errors';


function* setLang(action) {
  try {
    const { language } = action.payload;
    localStorage.setItem("language", language);
    const translations = yield call(API.getLanguage, language);
    yield put(addTranslationForLanguage(deepmerge(ENG, translations), language));
    yield put(setActiveLanguage(language));
  } catch (e) {
    yield handleError(e);
  }
}

export default function* () {
  yield takeEvery(SELECT_LANGUAGE, setLang);
}