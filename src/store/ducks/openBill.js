import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { all, put, take, call, select } from 'redux-saga/effects'
import { trasform } from "../../services/transformData"
import { companyRes } from '../mock'

/** Constants */
export const moduleName = 'openBill'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  reqnum: 1,
  renderData: false,
  companyResponse: null,
  requestLoading: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  }),
  errors: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
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
    case LOAD_COMPANY_INFO + UPDATE + FAIL:
      return state
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], true)
        .set('renderData', false)

    case LOAD_COMPANY_INFO + PC + UPDATE + START:
      return state
        .set('reqnum', id)
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
        .set('renderData', false)

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
    payload: {company: companyRes},
    inn
  }
}

export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}

/** Selectors */
export const companyResSelector = state => state[moduleName].get('companyResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading').toJS()
export const renderDataSelector = state => state[moduleName].get('renderData')
export const innSelector = state => state[moduleName].get('inn')
export const errorsSelector = state => state[moduleName].get('errors').toJS()

export const decodedCompanyResponse = createSelector(
  companyResSelector, (companyResponse) =>  companyResponse
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
    const { heads, management_companies, founders_fl, founders_ul, befenicials } = companyResponse
    const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
    return managementSource
  }
)

export const decodedRequestLoading = createSelector(
  requestLoadingSelector, (requestLoading) => requestLoading
)

/** Sagas */
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
      // const data = JSON.parse(res.data)
      console.log('RES | first update | ', data)
      const store = state => state[moduleName].get('companyResponse')
      const companyResponse = yield select(store)
      const updatedData = yield trasform._get_company_info_companySource(companyResponse, data.Data.Report)
  
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        reqnum: res.reqnum,
        payload: {updatedData},
      })
    } catch (err){
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + FAIL,
      })
    }
  }
}

const loadCompanyPCSaga = function * () {
  while(true){
    const action = yield take(LOAD_COMPANY_INFO)
    const api = { 
      type: 'get_company_ps',
      reqnum: 1,
      data: {
        code: action.inn
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
      // const data = JSON.parse(res.data)
      console.log('RES | PC update | ', data)
      const store = state => state[moduleName].get('companyResponse')

      if(data.ResultInfo.ResultType === "Data not found") {
        const companyResponse = yield select(store)
        const updatedData = yield trasform._get_company_info_companySource(companyResponse, { Successor : false, Predecessor: false})
        yield put({
          type: LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS,
          reqnum: res.reqnum,
          payload: {updatedData},
        })
      } else {
        const companyResponse = yield select(store)
        const updatedData = yield trasform._get_company_info_companySource(companyResponse, data.Data.Report.Reorganizations)
        yield put({
          type: LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS,
          reqnum: res.reqnum,
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
    loadCompanyPCSaga()
  ])
}

export default openBillReducer