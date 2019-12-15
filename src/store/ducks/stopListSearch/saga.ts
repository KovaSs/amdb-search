import { put, call, takeEvery, all } from 'redux-saga/effects'
import C from './constants'
import { trasform, cloCss, uuid } from "../../../services/utils"
import { API } from '../../../services/api'

/* Поиск стоп-листов по ФЛ */
const getSearchSaga = function * (action) {
  console.log('action', action)
  const idRequest = uuid()
  try {
    yield put({
      type: C.CLEAR_SEARCH_DATA
    })
    yield put({
      type: C.GET_SEARCH_DATA_START
    })

    if(action.payload.type === "fl") {
      /* Запрос данных по  */
      const [res, resBlack] = yield all([
        yield call(API.getSearchStopListWhite, action.payload.post, action.payload.type),
        yield call(API.getSearchStopListBlack, action.payload.post, action.payload.type)
      ])
  
      console.log("%cRES | GET SEARCH FL DATA WHITE",  cloCss.green, res)
      console.log("%cRES | GET SEARCH FL DATA BLACK",  cloCss.green, resBlack)
  
      if(res || resBlack ) {
        const data = yield call(trasform.customStopListSearch, 
          res.Status !== "Error" ? res.Response : [], 
          resBlack.Status !== "Error" ? resBlack.Response : []
        )
        yield put({
          type: C.GET_SEARCH_DATA_SUCCESS,
          payload: data,
          search: action.payload
        })
      } else {
        console.log('%cSLS -> getSearchFlSaga@Err', cloCss.yellow, "Данных вхождения в стоп-листы не найдено")
        yield put({
          type: C.GET_SEARCH_DATA_SUCCESS,
          payload: [],
          search: action.payload
        })
        yield put({
          type: C.REGISTER_ERROR,
          payload: {
            message: "Данных вхождения в стоп-листы не найдено!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      }
      if(res.Status === "Error") {
        yield put({
          type: C.REGISTER_ERROR,
          payload: {
            message: "Данные из черной базы - не получены!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      } 
      if(resBlack.Status === "Error") {
        yield put({
          type: C.REGISTER_ERROR,
          payload: {
            message: "Данные из черной базы - не получены!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      }
    } else {
      const res = yield call(API.getSearchStopListWhite, action.payload.post, action.payload.type)
      console.log("%cRES | GET SEARCH FL DATA WHITE",  cloCss.green, res)
  
      if(res && res.Status !== "Error" && res.Response.length) {
        const data = yield call(trasform.customStopListSearch, res.Response, [])
        yield put({
          type: C.GET_SEARCH_DATA_SUCCESS,
          payload: data,
          search: action.payload
        })
      } else {
        console.log('%cSLS -> getSearchFlSaga@Err', cloCss.yellow, "Данных вхождения в стоп-листы не найдено")
        yield put({
          type: C.GET_SEARCH_DATA_SUCCESS,
          payload: [],
          search: action.payload
        })
        yield put({
          type: C.REGISTER_ERROR,
          payload: {
            message: "Данных вхождения в стоп-листы не найдено!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      }
      if(res.Status === "Error") {
        yield put({
          type: C.REGISTER_ERROR,
          payload: {
            message: "Данные из черной базы - не получены!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      } 
    }

  } catch (err){
    console.log('%cSLS -> getSearchSaga@Err', cloCss.red, err)
    yield put({
      type: C.REGISTER_ERROR,
      payload: {
        message: "Ошибка работы компонета!",
        timeRequest: Date.now(),
        id: idRequest
      }
    })
  }
}

export const saga = function * () {
  yield takeEvery(C.GET_SEARCH_DATA, getSearchSaga)
}