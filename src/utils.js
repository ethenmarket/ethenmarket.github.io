import BN from "bignumber.js";
import isFloat from "validator/lib/isFloat";

export const from10e18BaseTokensPriceTo1Normal = (price, decimals) =>
  BN(price).times(`1e${decimals - 18}`);
export const from1TokenPriceTo10e18BaseTokens = (price, decimals) =>
  BN(price).times(`1e${18 - decimals}`);

export const fromBaseTokensToNormal = (base, decimals) =>
  BN(base).div(`1e${decimals}`);
export const fromNormalTokenToBase = (normal, decimals) =>
  BN(normal).times(`1e${decimals}`);

export const fromEtherToWei = ether => BN(ether).times(`1e18`);
export const fromWeiToEther = wei => BN(wei).div(`1e18`);

export const isValidAddress = address => /^0x[0-9a-fA-F]{40}$/.test(address);

export const cropAddress = (address, n = 6) =>
  address && `${address.slice(2, n + 2)}...${address.slice(-n)}`;

export const getFirtsSentence = string =>
  string && string.slice(0, string.indexOf("."));

export const tokenNameCompare = (a, b, invert) => {
  if (a === "ETH") return -1;
  if (b === "ETH") return 1;
  if (invert) {
    if (a === b) return 0;
    return a > b ? -1 : 1;
  }
  if (a === b) return 0;
  if (a.slice(0, 2) === "0x") return 1;
  if (b.slice(0, 2) === "0x") return -1;
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

const etherscanPrefix =
  process.env.REACT_APP_NETWORK_URL === "mainnet"
    ? ""
    : `${process.env.REACT_APP_NETWORK_URL}.`;
const etherscan = `https://${etherscanPrefix}etherscan.io`;
export const getLinkToAddress = address => `${etherscan}/address/${address}`;
export const getLinkToTransaction = tx => `${etherscan}/tx/${tx}`;

const isEthenEqual = (ethen1, ethen2) =>
  ethen1.current === ethen2.current && ethen1.losses === ethen2.losses;
export const countChangedColor = "rgb(19,180,206)";
export const getBalancesWithDiff = (oldBalances, newBalances) => {
  newBalances.ether.highlight = {};

  if (!isEthenEqual(newBalances.ether.ethen, oldBalances.ether.ethen)) {
    newBalances.ether.highlight.ethen = countChangedColor;
  }
  Object.keys(newBalances.tokens).forEach(tokenAddr => {
    if (oldBalances.tokens[tokenAddr]) {
      newBalances.tokens[tokenAddr].highlight = {};

      if (
        !isEthenEqual(
          newBalances.tokens[tokenAddr].ethen,
          oldBalances.tokens[tokenAddr].ethen
        )
      ) {
        newBalances.tokens[tokenAddr].highlight.ethen = countChangedColor;
      }
    }
  });
  return newBalances;
};

export const floorNumber = (number = 0, precision) => BN(number).toFixed(precision, BN.ROUND_FLOOR);

export const getCellContent = (value, precision) => {
  if (!value) return "";
  if (precision === true || !isFloat(value)) return value;

  return floorNumber(value, precision || 3);
};

export const getPrecision = number => {
  const str = number.toString(10);
  const index = str.indexOf(".");
  if (index === -1) return 0;
  return str.slice(index + 1).length;
};

export const createFormater = (data, maxPrecision) => {
  if (data === null) return (number) => floorNumber(number, maxPrecision);
  let maxPrec = 0;
  data.forEach(datum => {
    const precision = getPrecision(datum);
    if (precision > maxPrec) maxPrec = precision;
  });

  const prec = Math.min(maxPrecision, maxPrec);

  return number => floorNumber(number, prec);
};
