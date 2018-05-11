import { eventChannel } from 'redux-saga';
import { put, call, select, fork, cancel, cancelled, take, takeEvery, spawn } from 'redux-saga/effects';
import { updateUserAccount, updateUserBalance } from '../reducers/user';
import { SET_CURRENT_PROVIDER } from '../reducers/web3-provider';
import handlerError from './errors';

import getWeb3, { PRIVATE_KEY, getUserAddress, getAddressFromPK } from '../API/web3';
import { getAuthenticated } from '../reducers/actions';


const USER_UPDATE = 'USER_UPDATE';
const createWeb3Chanel = (web3, web3Provider) => eventChannel((emit) => {
  const startUpdateUserAccount = (account) => {
    if (!account) return;

    web3.eth.getBalance(account, (err, balance) => {
      if (err) {
        emit({ type: 'Error', err: err.message });
        return;
      }
      if (!balance) return;
      emit({
        type: USER_UPDATE,
        address: account.toLowerCase(),
        balance: balance.toString()
      });
    });
  };

  const accountInterval = setInterval(async () => {
    const account = await getUserAddress(web3, web3Provider);
    startUpdateUserAccount(account);
  }, 200);

  const unsubscribe = () => {
    clearInterval(accountInterval);
  };

  return unsubscribe;
});

function* filterWeb3Actions(action) {
  if (action.type === USER_UPDATE) {
    const user = yield select(state => state.user);
    const ether = yield select(state => state.balances.ether.wallet);
    const { address, balance } = action;
    if (user.address !== address) {
      yield put(updateUserAccount({ address }));
      yield put(getAuthenticated());
    };
    if (ether !== balance) {
      yield put(updateUserBalance({ balance }));
    }
  }
}

function* handleWeb3Actions () {
  let web3Chanel;
  let web3Provider;
  try {
    web3Provider = yield select(state => state.web3Provider.current);
    if (!web3Provider) return;
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

function* walletUpdates() {
  try {
    while (true) {
      const updates = yield fork(handleWeb3Actions);
      yield take([
        SET_CURRENT_PROVIDER
      ]);
      yield cancel(updates);
    }
  } catch(e) {
    console.error(e);
    yield handlerError(e);
  }
}


export default function* () {
  yield spawn(walletUpdates);
};