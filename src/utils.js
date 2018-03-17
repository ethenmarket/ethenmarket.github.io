import BN from 'bignumber.js';

export const from10e18BaseTokensPriceTo1Normal = (price, decimals) => BN(price).times(`1e${decimals - 18}`);
export const from1TokenPriceTo10e18BaseTokens = (price, decimals) => BN(price).times(`1e${18 - decimals}`);

export const fromBaseTokensToNormal = (base, decimals) => BN(base).div(`1e${decimals}`);
export const fromNormalTokenToBase = (normal, decimals) => BN(normal).times(`1e${decimals}`);

export const fromEtherToWei = (ether) => BN(ether).times(`1e18`);
export const fromWeiToEther = (wei) => BN(wei).div(`1e18`);

export const isValidAddress = (address) => /^0x[0-9a-fA-F]{40}$/.test(address);

export const cropAddress = (address, n = 6) => address && `${address.slice(2, n + 2)}...${address.slice(-n)}`;

export const getFirtsSentence = string => string && string.slice(0, string.indexOf('.'));

export const tokenNameCompare = (a, b, invert) => {
  if (a === 'ETH') return -1;
  if (b === 'ETH') return 1;
  if (invert) {
    if (a === b) return 0;
    return a > b ? -1 : 1;
  }
  if (a === b) return 0;
  if (a.slice(0, 2) === '0x') return 1;
  if (b.slice(0, 2) === '0x') return -1;
  return a > b ? 1 : -1;
};

export const numberComparator = (a, b, inverse = false) => {
  const aBN = BN(a);
  if (aBN.eq(b)) return 0;
  if (inverse) {
    return aBN.gt(b) ? -1 : 1;
  }
  return aBN.lt(b) ? -1 : 1;
};

export const getLinkToTransaction = (tx) => `https://ropsten.etherscan.io/tx/${tx}`;