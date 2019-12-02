import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { put, takeEvery, call, all } from 'redux-saga/effects'
import { cloCss, trasform, uuid } from "../../services/utils"
import { API } from '../../services/api'
import config from '../../config'

/** Constants */
export const moduleName = 'stopListSearch'
export const prefix = `${config.appName}/${moduleName}`

export const GET_SEARCH_DATA = `${prefix}/GET_SEARCH_DATA`
export const CLEAR_SEARCH_DATA = `${prefix}/CLEAR_SEARCH_DATA`
export const REGISTER_ERROR = `${prefix}/REGISTER_ERROR`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  searchRequest: null,
  searchData: [],
  requestLoading: Map({
    getSearchData: false,
  }),
  errors: Map({
    getSearchData: null,
    message: null
  })
})

const stopListSearcReducer = (state = new ReducerRecord(), action) => {
  const { type, payload } = action
  switch (type) {
    // Получение основных данных
    case GET_SEARCH_DATA + START:
      return state
        .setIn(['requestLoading', 'getSearchData'], true)
        .setIn(['errors', 'getSearchData'], false)      
    case GET_SEARCH_DATA + SUCCESS:
      return state
        .set('searchData', payload)
        .set('searchRequest', action.search)
        .setIn(['requestLoading', 'getSearchData'], false)
        .setIn(['errors', 'getSearchData'], false) 
    case GET_SEARCH_DATA + FAIL:
      return state
        .setIn(['requestLoading', 'getSearchData'], false)
        .setIn(['errors', 'getSearchData'], false)

      case REGISTER_ERROR:
        return state
          .setIn(['errors', 'message'], payload)

    case CLEAR_SEARCH_DATA:
      return new ReducerRecord()
      default:
        return state
    }
}

/** Actions */
// Поиск данных по
export const getSearchRequest = (post, type) => {
  return {
    type: GET_SEARCH_DATA,
    payload: {post, type}
  }
}

// Очистка всех данных перед следующим запросом
export const clearSearchData = () => {
  return {
    type: CLEAR_SEARCH_DATA
  }
}

/** Selectors */
export const mainDataSelector = state => state[moduleName].get('mainData')
export const searchRequestSelector = state => state[moduleName].get('searchRequest')
export const searchDataSelector = state => state[moduleName].get('searchData')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const errorsSelector = state => state[moduleName].get('errors')

export const ewsMainData = createSelector( mainDataSelector, (mainData) =>  mainData )
export const ewsErrors = createSelector( errorsSelector, (err) =>  err )
export const ewsSearchRequest = createSelector( searchRequestSelector, (searchRequest) =>  searchRequest )
export const ewsSearchData = createSelector( searchDataSelector, (searchData) =>  searchData )
export const ewsRequestLoading = createSelector( requestLoadingSelector, (requestLoading) => requestLoading )

/** Sagas */

/* Поиск стоп-листов по ФЛ */
const getSearchSaga = function * (action) {
  console.log('action', action)
  const idRequest = uuid()
  try {
    yield put({
      type: CLEAR_SEARCH_DATA
    })
    yield put({
      type: GET_SEARCH_DATA + START
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
          type: GET_SEARCH_DATA + SUCCESS,
          payload: data,
          search: action.payload
        })
      } else {
        console.log('%cSLS -> getSearchFlSaga@Err', cloCss.yellow, "Данных вхождения в стоп-листы не найдено")
        yield put({
          type: GET_SEARCH_DATA + SUCCESS,
          payload: [],
          search: action.payload
        })
        yield put({
          type: REGISTER_ERROR,
          payload: {
            message: "Данных вхождения в стоп-листы не найдено!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      }
      if(res.Status === "Error") {
        yield put({
          type: REGISTER_ERROR,
          payload: {
            message: "Данные из черной базы - не получены!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      } 
      if(resBlack.Status === "Error") {
        yield put({
          type: REGISTER_ERROR,
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
          type: GET_SEARCH_DATA + SUCCESS,
          payload: data,
          search: action.payload
        })
      } else {
        console.log('%cSLS -> getSearchFlSaga@Err', cloCss.yellow, "Данных вхождения в стоп-листы не найдено")
        yield put({
          type: GET_SEARCH_DATA + SUCCESS,
          payload: [],
          search: action.payload
        })
        yield put({
          type: REGISTER_ERROR,
          payload: {
            message: "Данных вхождения в стоп-листы не найдено!",
            timeRequest: Date.now(),
            id: idRequest
          }
        })
      }
      if(res.Status === "Error") {
        yield put({
          type: REGISTER_ERROR,
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
      type: REGISTER_ERROR,
      payload: {
        message: "Ошибка работы компонета!",
        timeRequest: Date.now(),
        id: idRequest
      }
    })
  }
}

export const saga = function * () {
  yield takeEvery(GET_SEARCH_DATA, getSearchSaga)
}

export default stopListSearcReducer