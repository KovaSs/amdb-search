import { saga as openBillSaga } from './ducks/openBill'
import { saga as EBGSaga } from './ducks/electronicBankGarantees'
import { saga as creditConveyorSaga } from './ducks/creditConveyor'
import { all } from 'redux-saga/effects'

export default function * rootSaga() {
  yield all([
    openBillSaga(),
    creditConveyorSaga(),
    // EBGSaga()
  ])
}