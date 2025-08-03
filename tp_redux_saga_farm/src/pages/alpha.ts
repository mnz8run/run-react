import { call } from 'redux-saga/effects';

const get = () => Promise.resolve(1);

function* fetchUser() {
  const number: unknown = yield call(get);
}
