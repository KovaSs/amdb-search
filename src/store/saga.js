import { saga as openBillSaga } from './ducks/openBill'
import { all } from 'redux-saga/effects'

export default function * rootSaga() {
  yield all([
    openBillSaga()
  ])
}