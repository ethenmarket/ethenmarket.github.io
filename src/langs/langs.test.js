/* eslint-disable camelcase */

import ko from './ko.json';
import en from './en.json';
import zh_cn from './zh-cn.json';
import es from './es.json';
import zh_tw from './zh-tw.json';

const langs = [ko, en, zh_cn, es, zh_tw];

it("Languages have same keys", () => {
  const langsKeys = langs.map(l => Object.keys(l));
  const keysMap = {};
  langsKeys.forEach(keys => {
    keys.forEach(key => {
      keysMap[key] = keysMap[key] ? keysMap[key] + 1 : 1;
    });
  });

  Object.keys(keysMap).forEach(key => {
    // if (keysMap[key] !== langs.length) console.log(key, keysMap[key]);
    expect(keysMap[key]).toEqual(langs.length);
  });
});