import { eventChannel } from 'redux-saga';
import { put, call, select, fork, cancel, cancelled, take } from 'redux-saga/effects';
import { updateUserAccount, USER_UPDATE_ACCOUNT } from '../reducers/user';
import { UPDATE_AVAILABLE_PROVIDERS, SELECT_CURRENT_PROVIDER } from '../reducers/web3-provider';

import getWeb3, { PRIVATE_KEY, getUserAddress, getAddressFromPK } from '../API/web3';
import { getBalances, getOwnOrders } from '../reducers/actions';

const createWeb3Chanel = (web3, web3Provider) => eventChannel((emit) => {

  const startUpdateUserAccount = (account) => {
    if (!account) return;

    web3.eth.getBalance(account, (err, balance) => {
      if (err) {
        emit({ type: 'Error', err: err.message });
        return;
      }
      if (!balance) return;
      emit(updateUserAccount({
        address: account,
        balance: balance.div('1e18').toString()
      }));
    });
  };

  const accountInterval = setInterval(() => {
    const account = getUserAddress(web3, web3Provider);
    startUpdateUserAccount(account);
  }, 250);

  const unsubscribe = () => {
    clearInterval(accountInterval);
  };

  return unsubscribe;
});

function* filterWeb3Actions(action) {
  if (action.type === USER_UPDATE_ACCOUNT) {
    const user = yield select(state => state.user);
    const { address, balance } = action.payload;
    if (user.address !== address || user.balance !== balance) {
      // USER CHANGED
      yield put(action);
      yield put(getBalances());
      yield put(getOwnOrders());
    };
  }
}

function* handleWeb3Actions () {
  let web3Chanel;
  let web3Provider;
  try {
    web3Provider = yield select(state => state.web3Provider.current);
    const web3 = yield call(getWeb3[web3Provider]);
    web3Chanel = yield call(createWeb3Chanel, web3, web3Provider);
    if (web3Provider === PRIVATE_KEY) {
      const pk = yield select(state => state.web3Provider.privateKey);
      web3.eth.defaultAccount = getAddressFromPK(pk);
    }
    while (true) {
      const action = yield take(web3Chanel);
      yield filterWeb3Actions(action);
    }
  } catch (e) {
    console.error(e);
  } finally {
    const isCancelled = yield cancelled();
    if (isCancelled) {
      console.log(`${web3Provider} web3 update was canceled`);
      if (web3Chanel) web3Chanel.close();
    };
  }
}

export default function* () {
  try {
    while (true) {
      const updates = yield fork(handleWeb3Actions);
      yield take([
        UPDATE_AVAILABLE_PROVIDERS,
        SELECT_CURRENT_PROVIDER
      ]);
      yield cancel(updates);
    }
  } catch(e) {
    console.log(e);}
};