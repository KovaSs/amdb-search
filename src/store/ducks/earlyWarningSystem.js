import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { put, takeEvery, call } from 'redux-saga/effects'
import { cloCss, trasform } from "../../services/utils"
import { API } from '../../services/api'
import config from '../../config'

/** Constants */
export const moduleName = 'earlyWarningSystem'
export const prefix = `${config.appName}/${moduleName}`

export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`
export const GET_MAIN_DATA = `${prefix}/GET_MAIN_DATA`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  mainData: [],
  requestLoading: new Map({
    mainData: false,
  }),
  errors: new Map({
    mainData: false,
  })
})

const earlyWarningSystemReducer = (state = new ReducerRecord(), action) => {
  const { type, payload } = action
  switch (type) {
    // Получение основных данных
    case GET_MAIN_DATA + START:
      return state
        .setIn(['requestLoading', 'mainData'], true)
        .setIn(['errors', 'mainData'], false)      
    case GET_MAIN_DATA + SUCCESS:
      return state
        .set('mainData', payload)
        .setIn(['requestLoading', 'mainData'], false)
        .setIn(['errors', 'mainData'], false) 
    case GET_MAIN_DATA + FAIL:
      return state
        .setIn(['requestLoading', 'mainData'], false)
        .setIn(['errors', 'mainData'], true)

    case CLEAR_COMPANY_INFO:
      return new ReducerRecord()
      default:
        return state
    }
}

/** Actions */
export const getMainData = interval => {
  return {
    type: GET_MAIN_DATA,
    payload: interval
  }
}

/** Selectors */
export const mainDataSelector = state => state[moduleName].get('mainData')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')

export const ewsMainData = createSelector( mainDataSelector, (mainData) =>  mainData )
export const ewsRequestLoading = createSelector( requestLoadingSelector, (requestLoading) => requestLoading )

/** Sagas */
/* Поиск исторических данных риск-факторов о ЮЛ */
const getMainDataSaga = function * (action) {
  try {
    yield put({
      type: GET_MAIN_DATA + START
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getEwsData, action.payload)

    console.log("%cRES | GET MAIN DATA",  cloCss.green, res)

    if(res.length) {
      const data = trasform.getUuid(res)
      yield put({
        type: GET_MAIN_DATA + SUCCESS,
        payload: data
      })
    } else {
      console.log('%cESW -> getMainDataSaga', cloCss.red, "Ошибка ответа на запрос данных")
      yield put({
        type: GET_MAIN_DATA + FAIL
      })
    }

  } catch (err){
    console.log('%cESW -> getMainDataSaga', cloCss.red, err)
    yield put({
      type: GET_MAIN_DATA + FAIL
    })
  }
}

export const saga = function * () {
  yield takeEvery(GET_MAIN_DATA, getMainDataSaga)
}

export default earlyWarningSystemReducer