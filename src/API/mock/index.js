import chartData from './sticks.json';
import tokenList from './tokens-list.json';

const makeResponse = data => () => Promise.resolve({ data });

export default {
  getChartData: makeResponse(chartData),
  getTokenList: makeResponse(tokenList)
};