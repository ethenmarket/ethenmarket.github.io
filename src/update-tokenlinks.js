const fs = require('fs');
const { tokens } = require('./API/mock/tokens-list');

const tokenlinks = require('./tokenlinks');

tokens.forEach(t => {
  if (t.link) {
    tokenlinks.tokens[t.link] = t.address;
  }
});

tokenlinks.default = Object.keys(tokenlinks.tokens)[0]; // eslint-disable-line
fs.writeFileSync(`${__dirname}/tokenlinks.json`, JSON.stringify(tokenlinks));
