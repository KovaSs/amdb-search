import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { all, put, take, call, select } from 'redux-saga/effects'
import { trasform } from "../../services/transformData"
import { companyRes, identifyInfoMock, bicompactResMock, bicompactPCResMock, ipResMock, ipCroinformMock } from '../mock'

/* Mock данные */
const dataMock = { companyRes, identifyInfoMock, bicompactResMock, bicompactPCResMock, ipResMock, ipCroinformMock }

/** Constants */
export const moduleName = 'openBill'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`
export const GET_IDENTIFY_USER = `${prefix}/GET_IDENTIFY_USER`
export const GET_CROINFORM_USER_INFO = `${prefix}/GET_CROINFORM_USER_INFO`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  isIp: false,
  reqnum: '',
  renderData: false,
  companyResponse: null,
  croinformResponse: new Map({}),
  requestLoading: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false,
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  }),
  errors: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false,
    identifyUser: new Map({}),
    croinformRequest: new Map({})
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
        .set('isIp', action.isIp)
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
        .setIn(['requestLoading', 'identifyUser', action.loading], true)
        .setIn(['errors', 'identifyUser', action.loading], false)
    case GET_IDENTIFY_USER + SUCCESS:
      return state
        .set('companyResponse', payload.updatedUserInfo)
        .setIn(['requestLoading', 'identifyUser', action.loading], false)
        .setIn(['errors', 'identifyUser', action.loading], false) 
    case GET_IDENTIFY_USER + FAIL:
      return state
        .setIn(['requestLoading', 'identifyUser', action.error], false)
        .setIn(['errors', 'identifyUser', action.error], true)

    case GET_CROINFORM_USER_INFO + START:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
    case GET_CROINFORM_USER_INFO + SUCCESS:
      return state
        .setIn(['croinformResponse', action.loading], payload.data)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case GET_CROINFORM_USER_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest'], false)
        .setIn(['errors', 'croinformRequest', action.loading], true)

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

export const actionGetUserCroinformInfo = user => {
  return {
    type: GET_CROINFORM_USER_INFO,
    payload: {...user}
  }
}

export const loadCompanyInfo = inn => {
  return {
    type: LOAD_COMPANY_INFO,
    payload: {company: dataMock.companyRes},
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
export const renderDataSelector = state => state[moduleName].get('renderData')
export const isIpSelector = state => state[moduleName].get('isIp')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
export const сroinformResSelector = state => state[moduleName].get('croinformResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const errorsSelector = state => state[moduleName].get('errors').toJS()

export const decodedCompanyResponse = createSelector( companyResSelector, (companyResponse) =>  companyResponse )
export const decodedisIp = createSelector( isIpSelector, (isIp) =>  isIp )
export const decodedСroinformResponse = createSelector( сroinformResSelector, (сroinformRes) =>  сroinformRes )
export const decodedCompanyName = createSelector( nameCompanySelector, (companyName) =>  companyName )
export const decodedReqnum = createSelector( reqnumSelector, (reqnum) => reqnum )
export const decodedInn = createSelector( innSelector, (inn) => inn )
export const decodedErrors = createSelector( errorsSelector, (errors) => errors )
export const decodedRenderData = createSelector( renderDataSelector, (renderData) => renderData )
export const decodedRequestLoading = createSelector( requestLoadingSelector, (requestLoading) => requestLoading )

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

/** Sagas */

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * () {
  while(true){
    const action = yield take(LOAD_COMPANY_INFO)

    try {
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + START
      })
  
      /* Переключение на mock данные */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'get_company_info',
              data: {
                code: action.inn
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Данные о кампании не обновлены!")
        })
      })

      /* Mock данные о ЮЛ */
      // const res = {ip: false, data: dataMock.bicompactResMock, reqnum: 666}
      /** Mock данные о ФЛ */
      // const res = {ip: true, data: dataMock.ipResMock.data, reqnum: 666}

      const data = res.data
      console.log('RES | FIRST UPDATE | ', data)
      const store = state => state[moduleName].get('companyResponse')
      const companyResponse = yield select(store)

      if(res.ip) {
        const updatedData = yield trasform._companySource_ip(companyResponse, data)
        yield put({
          type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
          id: res.reqnum, 
          isIp: true,
          payload: {updatedData},
        })
      } else {
        const updatedData = yield trasform._get_company_info_companySource(companyResponse, data)
        yield put({
          type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
          id: res.reqnum,
          isIp: false,
          payload: {updatedData},
        })
      }

    } catch (err){
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + FAIL,
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
    
    try {
      if(action.isIp) throw new TypeError("Данные о кампании не обновлены!")
      yield put({
        type: LOAD_COMPANY_INFO + PC + UPDATE + START
      })

      /* Запрос данных о приемниках*/
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'get_company_ps',
              reqnum: action.id,
              data: {
                code: storeInn.inn
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Данные о кампании не обновлены!")
        })
      }) 
      
      /* Получение данных из mock */
      // const res = {ip: true, data: dataMock.bicompactPCResMock, reqnum: 666}
      
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

/* Идентификация пользователя */
const identifyUserSaga = function * () {
  while(true){
    const action = yield take(GET_IDENTIFY_USER)
    const reqnum = state => state[moduleName].get('reqnum')
    const companyState = state => state[moduleName].get('companyResponse')
    const storeReqnum = yield select(reqnum)
    const storeOgrn = yield select(companyState)

    try {
      yield put({
        type: GET_IDENTIFY_USER + START,
        loading: action.payload.inn
      })

      /* Переключение на mock данные */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'identify_user',
              reqnum: storeReqnum,
              data: {
                FirstName: action.payload.first_name,
                MiddleName: action.payload.middle_name,
                SurName: action.payload.last_name,
                INN: action.payload.inn,
                OGRN: storeOgrn.ogrn
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Ошибка получения данных!")
        })
      })

      /** Mock данные о Идентификационных данных */
      // const res = {ip: true, data: dataMock.identifyInfoMock, reqnum: 666}

      const data = res.data
      console.log('RES | GET USER INFO | ', res) 

      if(data) {
        const updatedUserInfo = yield trasform._identifyUserInfo(storeOgrn, data, action.payload.inn)
        yield put({
          type: GET_IDENTIFY_USER + SUCCESS,
          payload: {updatedUserInfo},
          loading: action.payload.inn
        })
      } else {
        throw new TypeError("Ошибка получения данных!")
      }

    } catch (err){
      yield put({
        type: GET_IDENTIFY_USER + FAIL,
        error: action.payload.inn
      })
    }
  }
}

/* Получение полной информации из источников об проверяемом пользователе */
const identifyUserInfoSaga = function * () {
  while(true){
    const action = yield take(GET_CROINFORM_USER_INFO)
    const reqnum = state => state[moduleName].get('reqnum')
    const storeReqnum = yield select(reqnum)
    const companyState = state => state[moduleName].get('companyResponse')
    const storeOgrn = yield select(companyState)

    try {
      yield put({
        type: GET_CROINFORM_USER_INFO + START,
        loading: action.payload.INN
      })

      /* Переключение на mock данные */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'request_user',
              reqnum: storeReqnum,
              data: {
                OGRN: storeOgrn.ogrn,
                INN: action.payload.INN,
                FirstName: action.payload.FirstName,
                FirstNameArch: action.payload.FirstNameArch,
                MiddleName: action.payload.MiddleName,
                SurName:action.payload.SurName,
                DateOfBirth: action.payload.DateOfBirth,
                Seria: action.payload.Seria,
                Number: action.payload.Number,
                RegionExp: action.payload.RegionExp,
                CityExp: action.payload.CityExp,
                StreetExp: action.payload.StreetExp,
                HouseExp: action.payload.HouseExp,
                BuildExp: action.payload.BuildExp,
                BuildingExp: action.payload.BuildingExp,
                FlatExp: action.payload.FlatExp,
                AFF: 1,
                Exp: 1,
                ExpArch: 1
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Ошибка получения данных!")
        })
      })
  
      /** Mock данные о Идентификационных данных */
      // const res = {ip: true, data: dataMock.ipCroinformMock.data, reqnum: 666}

      const data = res.data
      console.log('RES | GET CROINFORM USER INFO | ', res) 

      yield put({
        type: GET_CROINFORM_USER_INFO + SUCCESS,
        payload: {data},
        loading: action.payload.INN
      })
    } catch (err){
      yield put({
        type: GET_CROINFORM_USER_INFO + FAIL,
        error: action.payload.INN
      })
    }
  }
}

export const saga = function * () {
  yield all([
    loadCompanyInfoSaga(),
    loadCompanyPCSaga(),
    identifyUserSaga(),
    identifyUserInfoSaga()
  ])
}

export default openBillReducer