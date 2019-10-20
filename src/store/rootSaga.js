import { saga as creditConveyorSaga } from './ducks/creditConveyor'
import { saga as openBillSaga } from './ducks/openBill'
import { saga as ebgSaga } from './ducks/EBG'
import { saga as earlyWarningSystemSaga } from './ducks/earlyWarningSystem'
import { saga as stopListSearchSaga } from './ducks/stopListSearch'
import { all } from 'redux-saga/effects'

export default function * rootSaga() {
  yield all([
    creditConveyorSaga(),
    openBillSaga(),
    ebgSaga(),
    earlyWarningSystemSaga(),
    stopListSearchSaga()
  ])
}