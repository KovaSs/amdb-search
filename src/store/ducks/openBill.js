import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { all, put, take, call, select } from 'redux-saga/effects'
import { trasform } from "../../services/transformData"
import { companyRes, identifyInfo, companyResponse } from '../mock'

/** Constants */
export const moduleName = 'openBill'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`
export const GET_IDENTIFY_USER = `${prefix}/GET_IDENTIFY_USER`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  reqnum: '',
  renderData: false,
  companyResponse: null,
  requestLoading: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false,
    identifyUser: new Map({})
  }),
  errors: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false,
    identifyUser: new Map({})
  })
})

const openBillReducer = (state = new ReducerRecord(), action) => {
  const { type, payload, id } = action
  switch (type) {
    case ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    case LOAD_COMPANY_INFO:
      return state
        .set('companyResponse', payload.company)

    case LOAD_COMPANY_INFO + UPDATE + START:
      return state
      .set('reqnum', id)
      .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
      .setIn(['errors', 'companyMainInfoUpdate'], false)      
    case LOAD_COMPANY_INFO + UPDATE + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], false) 
        .set('renderData', true)
        .set('reqnum', id)
    case LOAD_COMPANY_INFO + UPDATE + FAIL:
      return state
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], true)
        .set('renderData', false)

    case LOAD_COMPANY_INFO + PC + UPDATE + START:
      return state
        .setIn(['requestLoading', 'companyPCUpdate'], true)
        .setIn(['errors', 'companyPCUpdate'], false)
    case LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'companyPCUpdate'], false)
        .setIn(['errors', 'companyPCUpdate'], false) 
    case LOAD_COMPANY_INFO + PC + UPDATE + FAIL:
      return state
        .setIn(['requestLoading', 'companyPCUpdate'], false)
        .setIn(['errors', 'companyPCUpdate'], true)

    case GET_IDENTIFY_USER + START:
      return state
        .setIn(['requestLoading', 'identifyUser'], true)
        .setIn(['errors', 'identifyUser'], false)
    case GET_IDENTIFY_USER + SUCCESS:
      return state
        .set('companyResponse', payload.updatedUserInfo)
        .setIn(['requestLoading', 'identifyUser'], false)
        .setIn(['errors', 'identifyUser'], false) 
    case GET_IDENTIFY_USER + FAIL:
      return state
        .setIn(['requestLoading', 'identifyUser'], false)
        .setIn(['errors', 'identifyUser'], true)

    case CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}

/** Actions */
export const actionChangeInn = inn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: {inn}
  }
}

export const loadCompanyInfo = inn => {
  return {
    type: LOAD_COMPANY_INFO,
    payload: {company: companyResponse},
    inn
  }
}

export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}

export const identifyUser = data => {
  return {
    type: GET_IDENTIFY_USER,
    payload: data
  }
}

/** Selectors */
export const companyResSelector = state => state[moduleName].get('companyResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading').toJS()
export const renderDataSelector = state => state[moduleName].get('renderData')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const errorsSelector = state => state[moduleName].get('errors').toJS()

export const decodedCompanyResponse = createSelector(
  companyResSelector, (companyResponse) =>  companyResponse
)

export const decodedReqnum = createSelector(
  reqnumSelector, (reqnum) => reqnum
)

export const decodedInn = createSelector(
  innSelector, (inn) => inn
)

export const decodedErrors = createSelector(
  errorsSelector, (errors) => errors
)

export const decodedRenderData = createSelector(
  renderDataSelector, (renderData) => renderData
)

export const decodedMainCompanySource = createSelector(
  companyResSelector, (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, sanctions, isponlit_proizvodstva, ...companySource} = companyResponse
    return companySource
  }
)

export const decodedRiskSource = createSelector(
  companyResSelector, (companyResponse) => {
    const { arbiter, fns, sanctions, isponlit_proizvodstva } = companyResponse
    const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
    return riskSource
  }
)

export const decodedManagementSource = createSelector(
  companyResSelector, (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials, leaders_list } = companyResponse
    const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials, leaders_list }
    return managementSource
  }
)

export const decodedRequestLoading = createSelector(
  requestLoadingSelector, (requestLoading) => requestLoading
)

/** Sagas */

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * () {
  while(true){
    const action = yield take(LOAD_COMPANY_INFO)
    const api = { 
      type: 'get_company_info',
      data: {
        code: action.inn
      }
    }
    try {
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + START
      })
  
      // const res = yield call(() => {
      //   return fetch(
      //     `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      //     { 
      //       method: 'POST',
      //       mode: 'cors',
      //       credentials: 'include',
      //       body : JSON.stringify(api),
      //     }
      //   )
      //   .then(res => {
      //     if (res.ok) return res.json()
      //     throw new TypeError("Данные о кампании не обновлены!")
      //   })
      // })

      // const data = res.data
      // console.log('RES | first update | ', res)
      const store = state => state[moduleName].get('companyResponse')
      const companyResponse = yield select(store)
      // const updatedData = yield trasform._get_company_info_companySource(companyResponse, companyResponse)
  
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        // id: res.reqnum,
        payload: {updatedData: companyResponse},
      })
    } catch (err){
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + FAIL,
      })
    }
  }
}

/* Идентификация пользователя */
const identifyUserSaga = function * () {
  while(true){
    const action = yield take(GET_IDENTIFY_USER)
    const reqnum = state => state[moduleName].get('reqnum')
    const companyState = state => state[moduleName].get('companyResponse')
    const storeReqnum = yield select(reqnum)
    const storeOgrn = yield select(companyState)

    const api = { 
      type: 'identify_user',
      reqnum: storeReqnum,
      data: {
        FirstName: action.payload.first_name,
        MiddleName: action.payload.middle_name,
        SurName: action.payload.last_name,
        INN: action.payload.inn,
        OGRN: storeOgrn.ogrn
      }
    }

    console.log('api', api)
    try {
      yield put({
        type: GET_IDENTIFY_USER + START,
        loading: action.payload.inn
      })

      /*
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify(api),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Ошибка получения данных!")
        })
      })
      */
  
      // console.log('RES | GET USER INFO | ', res)
      const updatedUserInfo = yield trasform._identifyUserInfo(storeOgrn, identifyInfo, action.payload.inn)

      yield put({
        type: GET_IDENTIFY_USER + SUCCESS,
        payload: {updatedUserInfo},
        loading: action.payload.inn
      })
    } catch (err){
      yield put({
        type: GET_IDENTIFY_USER + FAIL,
        error: action.payload.inn
      })
    }
  }
}

/* Получение данных о предшедственнниках и приемниках */
const loadCompanyPCSaga = function * () {
  while(true){
    const action = yield take(LOAD_COMPANY_INFO + UPDATE + SUCCESS)
    const store = state => state[moduleName].get('companyResponse')
    const storeInn = yield select(store)

    const api = { 
      type: 'get_company_ps',
      reqnum: action.id,
      data: {
        code: storeInn.inn
      }
    }
    try {
      yield put({
        type: LOAD_COMPANY_INFO + PC + UPDATE + START
      })

      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify(api),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Данные о кампании не обновлены!")
        })
      })
  
      const data = res.data
      console.log('RES | PC update | ', data)
      const store = state => state[moduleName].get('companyResponse')
      
      if(data === null) {
        const companyResponse = yield select(store)
        const updatedData = yield trasform._get_company_info_companySource(companyResponse, { Successor : false, Predecessor: false})
        yield put({
          type: LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS,
          // reqnum: res.reqnum,
          payload: {updatedData},
        })
      } else {
        const companyResponse = yield select(store)
        const updatedData = yield trasform._get_company_info_companySource(companyResponse, data.Reorganizations)
        yield put({
          type: LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS,
          // reqnum: res.reqnum,
          payload: {updatedData},
        })
      }
    } catch (err){
      yield put({
        type: LOAD_COMPANY_INFO + PC + UPDATE + FAIL,
      })
    }
  }
}

export const saga = function * () {
  yield all([
    loadCompanyInfoSaga(),
    // loadCompanyPCSaga(),
    identifyUserSaga()
  ])
}

export default openBillReducer