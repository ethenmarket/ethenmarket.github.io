/* eslint-disable */
const pug = require("pug");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const argv = require('minimist')(process.argv.slice(2));

const CONTENT_PREFIX = 'content.';

const getLanguageCode = filename => {
  const strings = filename.split('.');
  return strings[strings.length - 2];
}

const langs = fs.readdirSync(__dirname)
  .filter(name => name.includes(CONTENT_PREFIX))
  .map(getLanguageCode);

const indexPath = path.resolve(__dirname, 'index.pug');
const indexContent = fs.readFileSync(indexPath, { encoding: "utf-8"});

fse.copySync( // copy media to build
  path.resolve(__dirname, 'media'),
  path.resolve(__dirname, '../build', 'media-faq')
);

const generateFAQ = (lang, filename) => {
  try {
    const indexContentWithLang = indexContent.replace("#{lang}", lang); // rewrite template for current lang
    fs.writeFileSync(indexPath, indexContentWithLang);
    const compiledFunction = pug.compileFile(indexPath);
    const page = compiledFunction({ // generate page
      lang
    });
    fs.writeFileSync(path.resolve(__dirname, "../build", filename), page); // write page to file
  } catch (e) {
    console.error(e);
    fs.writeFileSync(indexPath, indexContent); // reset default template
  }
}

generateFAQ('en', `faq.html`); // generate default faq with english lang

langs.forEach(lang => {
  generateFAQ(lang, `faq.${lang}.html`); // generate faq for every lang
});

fs.writeFileSync(indexPath, indexContent); // reset default template
