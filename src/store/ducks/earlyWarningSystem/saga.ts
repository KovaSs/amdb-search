import { put, call, takeEvery } from 'redux-saga/effects'
import C from './constants'
import { trasform, cloCss } from "../../../services/utils"
import { API } from '../../../services/api'

/* Поиск исторических данных риск-факторов о ЮЛ */
const getMainDataSaga = function * (action) {
  try {
    yield put({
      type: C.GET_MAIN_DATA_START
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getEwsData, action.payload)

    console.log("%cRES | GET MAIN DATA",  cloCss.green, res)

    if(res.length) {
      const data = trasform.getUuid(res)
      yield put({
        type: C.GET_MAIN_DATA_SUCCESS,
        payload: data
      })
    } else {
      console.log('%cESW -> getMainDataSaga', cloCss.red, "Ошибка ответа на запрос данных")
      yield put({
        type: C.GET_MAIN_DATA_FAIL
      })
    }

  } catch (err){
    console.log('%cESW -> getMainDataSaga', cloCss.red, err)
    yield put({
      type: C.GET_MAIN_DATA_FAIL
    })
  }
}

export const saga = function * () {
  yield takeEvery(C.GET_MAIN_DATA, getMainDataSaga)
}