import { SET_CURRENT_TOKEN } from './reducers/tokens';

const Routes = {
  [SET_CURRENT_TOKEN]: {
    path: '/token/:address',
    fromPath: (path) => `0x${path}`,
    toPath: value => value.slice(2)
  }
};



export default Routes;