import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { all, put, take, call, select, spawn } from 'redux-saga/effects'
import { trasform } from "../../services/utils"
import { companyRes, identifyInfoMock, bicompactResMock, ipResMock, ipCroinformMock } from '../mock'

/* Mock данные */
const dataMock = { companyRes, identifyInfoMock, bicompactResMock, ipResMock, ipCroinformMock }
const cloCss = "color:white; background-color: green; padding: 0 5px"

/** Constants */
export const moduleName = 'openBill'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`
export const GET_IDENTIFY_USER = `${prefix}/GET_IDENTIFY_USER`
export const GET_CROINFORM_USER_INFO = `${prefix}/GET_CROINFORM_USER_INFO`
export const ADD_USER_TO_CHECK_LIST = `${prefix}/ADD_USER_TO_CHECK_LIST`
export const GET_AFFILATES_LIST = `${prefix}/GET_AFFILATES_LIST`
export const GET_AFFILATES_UL = `${prefix}/GET_AFFILATES_UL`
export const LOAD_DIGEST_LIST = `${prefix}/LOAD_DIGEST_LIST`
export const ADD_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_IN_DIGEST_LIST`

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
  digestList: null, 
  croinformResponse: new Map({}),
  requestLoading: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    getAffilatesUl: new Map({}),
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  }),
  errors: new Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    getAffilatesUl: new Map({}),
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

    case GET_AFFILATES_LIST + START:
      return state
      .setIn(['requestLoading', 'getAffilatesList'], true)
      .setIn(['errors', 'getAffilatesList'], false)      
    case GET_AFFILATES_LIST + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], false) 
    case GET_AFFILATES_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], true)

    case GET_AFFILATES_UL + START:
      return state
      .setIn(['requestLoading', 'getAffilatesUl', action.inn], true)
      .setIn(['errors', 'getAffilatesUl', action.inn], false)      
    case GET_AFFILATES_UL + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'getAffilatesUl', action.inn], false)
        .setIn(['errors', 'getAffilatesUl', action.inn], false) 
    case GET_AFFILATES_UL + FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.inn], false)
        .setIn(['errors', 'getAffilatesUl', action.inn], true)

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
        .setIn(['croinformResponse', action.loading], payload.html)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case GET_CROINFORM_USER_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest'], false)
        .setIn(['errors', 'croinformRequest', action.loading], true)

    case LOAD_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'digestList'], true)
        .setIn(['errors', 'digestList'], false)
    case LOAD_DIGEST_LIST + SUCCESS:
      return state
        .set('digestList', payload.digest)
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], false) 
    case LOAD_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], true)

    case ADD_RISK_FACTOR_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], true)
        .setIn(['errors', 'addRistFactorInDigestList'], false)
    case ADD_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS:
      return state
        .set('digestList', payload.digest)
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], false) 
    case ADD_RISK_FACTOR_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], true)

    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS:
      return state
        .set('digestList', payload.digest)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    case ADD_USER_TO_CHECK_LIST:
      return state
        .set('companyResponse', trasform._addNewUserToCheckList(state.get('companyResponse'), payload.newUser))

    case CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}

/** Actions */
// Установка ИНН проверяемой организации
export const actionChangeInn = inn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: {inn}
  }
}
// Проверка юзера через Croinform
export const actionGetUserCroinformInfo = (user, id) => {
  return {
    type: GET_CROINFORM_USER_INFO,
    payload: {...user},
    loading: id
  }
}
// Загрузка основных перевоначальных данных о кампании
export const loadCompanyInfo = inn => {
  return {
    type: LOAD_COMPANY_INFO,
    payload: {company: dataMock.companyRes},
    inn
  }
}
// Очистка всех данных перед следующим запросом
export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}
//Идентификация юзера для автозаполнения
export const identifyUser = data => {
  return {
    type: GET_IDENTIFY_USER,
    payload: data
  }
}
//Идентификация юзера для автозаполнения
export const addNewUserToCheackList = newUser => {
  return {
    type: ADD_USER_TO_CHECK_LIST,
    payload: {newUser}
  }
}
// Добавление нового риск-фактора
export const addRiskFactor = factor => {
  return {
    type: ADD_RISK_FACTOR_IN_DIGEST_LIST,
    payload: {...factor}
  }
}
// Добавление нового риск-фактора
export const deleteRiskFactor = factor => {
  return {
    type: DELETE_RISK_FACTOR_IN_DIGEST_LIST,
    payload: {...factor}
  }
}

/** Selectors */
export const companyResSelector = state => state[moduleName].get('companyResponse')
export const digetsListSelector = state => state[moduleName].get('digestList')
export const renderDataSelector = state => state[moduleName].get('renderData')
export const isIpSelector = state => state[moduleName].get('isIp')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
export const сroinformResSelector = state => state[moduleName].get('croinformResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const errorsSelector = state => state[moduleName].get('errors').toJS()

export const decodedCompanyResponse = createSelector( companyResSelector, (companyResponse) =>  companyResponse )
export const decodedDigetsList = createSelector( digetsListSelector, (digets) =>  digets )
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
    const { arbiter, fns, sanctions, isponlit_proizvodstva, spiski, spark_spiski } = companyResponse
    const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva, spiski, spark_spiski }
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
      // yield delay(2000); const res = {...dataMock.bicompactResMock}
      /** Mock данные о ФЛ */
      // const res = {ip: true, data: dataMock.ipResMock.data, reqnum: 666}

      const data = res.data.company_info
      console.log("%cRES | FIRST UPDATE", cloCss, res)
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
      console.log('err', err)
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + FAIL,
      })
    }
  }
}

/* Получение данных о предшедственнниках и приемниках */
const loadAffilatesListSaga = function * () {
  while(true){
    const action = yield take(LOAD_COMPANY_INFO + UPDATE + SUCCESS)
    const store = state => state[moduleName].get('companyResponse')
    const storeInn = yield select(store)
    if(!action.isIp) {
      try {
        yield put({
          type: GET_AFFILATES_LIST + START
        })
  
        /* Запрос данных о приемниках */
        const res = yield call(() => {
          return fetch(
            `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
            { 
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              body : JSON.stringify({ 
                type: 'get_affilates',
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
        // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
        
        const data = res.data
        console.log("%cRES | GET AFFILATES LIST", "color:white; background-color: green; padding: 0 5px", res)
        const store = state => state[moduleName].get('companyResponse')
        
        const companyResponse = yield select(store)
        const updatedData = yield trasform._updateManagmentSource(companyResponse, data)

        yield put({
          type: GET_AFFILATES_LIST + SUCCESS,
          // reqnum: res.reqnum,
          payload: {updatedData},
        })
      } catch (err){
        console.log('err', err)
        yield put({
          type: GET_AFFILATES_LIST + FAIL,
        })
      }
    }
  }
}

/* Получение данных о предшедственнниках и приемниках */
const loadAffilatesUlSaga = function * () {
  while(true){
    const action = yield take(GET_AFFILATES_LIST + SUCCESS)
    if(action.payload.updatedData.founders_ul.length) {
      yield all(action.payload.updatedData.founders_ul.map(item => {
        if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
        else return item
      }))
    }else if(action.payload.updatedData.heads_ul.length) {
      yield all(action.payload.updatedData.heads_ul.map(item => {
        if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
        else return item
      }))
    }else if(action.payload.updatedData.share_holders_ul.length) {
      yield all(action.payload.updatedData.share_holders_ul.map(item => {
        if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
        else return item
      }))
    }
  }
}

/* Получение данных о риск-факторах */
const loadDigestListSaga = function * () {
  while(true){
    yield take(LOAD_COMPANY_INFO + UPDATE + SUCCESS)
    const reqnum = state => state[moduleName].get('reqnum')
    const storeReqnum = yield select(reqnum)
    try {
      yield put({
        type: LOAD_DIGEST_LIST + START
      })

      /* Запрос данных для DigetsList */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'digest',
              reqnum: storeReqnum,
              data: {}
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Данные о кампании не обновлены!")
        })
      })
      
      /* Получение данных из mock */
      // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
      
      const digest = res.data
      console.log("%cRES | LOAD DIGEST LIST", "color:white; background-color: green; padding: 0 5px", res)

      yield put({
        type: LOAD_DIGEST_LIST + SUCCESS,
        payload: {digest},
      })
    } catch (err){
      console.log('err', err)
      yield put({
        type: LOAD_DIGEST_LIST + FAIL,
      })
    }
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorSaga = function * () {
  while(true){
    const action = yield take(ADD_RISK_FACTOR_IN_DIGEST_LIST)
    const reqnum = state => state[moduleName].get('reqnum')
    const storeReqnum = yield select(reqnum)
    try {
      yield put({
        type: ADD_RISK_FACTOR_IN_DIGEST_LIST + START
      })

      /* Запрос на добавление нового риск-фактора  */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'digest',
              reqnum: storeReqnum,
              data: {
                ...action.payload
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
      // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
      
      const digest = res.data
      console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST", "color:white; background-color: green; padding: 0 5px", res)

      yield put({
        type: ADD_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
        payload: {digest},
      })
    } catch (err){
      console.log('err', err)
      yield put({
        type: ADD_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
      })
    }
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorSaga = function * () {
  while(true){
    const action = yield take(DELETE_RISK_FACTOR_IN_DIGEST_LIST)
    const reqnum = state => state[moduleName].get('reqnum')
    const storeReqnum = yield select(reqnum)
    try {
      yield put({
        type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + START
      })

      /* Запрос на добавление нового риск-фактора  */
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify({ 
              type: 'digest',
              reqnum: storeReqnum,
              data: {
                ...action.payload
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
      // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
      
      const digest = res.data
      console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST", "color:white; background-color: green; padding: 0 5px", res)

      yield put({
        type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
        payload: {digest},
      })
    } catch (err){
      console.log('err', err)
      yield put({
        type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
      })
    }
  }
}

const getRequestAffiliatesUlSaga = function * (inn, user) {
  try {
    yield put({
      type: GET_AFFILATES_UL + START,
      inn
    })

    const store = state => state[moduleName]
    const storeState = yield select(store)
    /* Запрос данных о приемниках */
    const res = yield call(() => {
      return fetch(
        `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
        { 
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body : JSON.stringify({ 
            type: 'get_affilates',
            reqnum: storeState.get('reqnum'),
            data: {
              code: inn
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
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const data = res.data
    console.log("%cRES | GET CHECK AFFILATES UL", "color:white; background-color: green; padding: 0 5px", res)
    
    const companyRes = yield select(store)
    const updatedData = yield trasform._updateManagmentULSource(companyRes.get("companyResponse"), data, user)

    yield put({
      type: GET_AFFILATES_UL + SUCCESS,
      payload: {updatedData},
      inn: inn
    })
  } catch (err){
    console.log('err', err)
    yield put({
      type: GET_AFFILATES_UL + FAIL,
      inn: inn
    })
  }
}



/* Идентификация пользователя */
const identifyUserSaga = function * () {
  while(true){
    const action = yield take(GET_IDENTIFY_USER)
    const reqnum = state => state[moduleName].get('reqnum')
    const storeReqnum = yield select(reqnum)
    const companyState = state => state[moduleName].get('companyResponse')
    const storeOgrn = yield select(companyState)
    const isIP = state => state[moduleName].get('isIp')
    const storeIsIP = yield select(isIP)
    console.log('ACTION', action)
    try {
      yield put({
        type: GET_IDENTIFY_USER + START,
        loading: action.payload.id
      })
      
      /* Запрос на идентификацию проверяемого объекта */
      const res = yield call(() => {
        if(!storeIsIP) {
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
                OGRN: action.payload.organisation ? action.payload.organisation.ogrn : storeOgrn.ogrn
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Ошибка получения данных!")
        })
      } else {
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
                INNIP: action.payload.inn,
              }
            }),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Ошибка получения данных!")
        })
      }})

      /** Mock данные о Идентификационных данных */
      // yield delay(2000); const res = {ip: true, data: dataMock.identifyInfoMock, reqnum: 666}

      const data = res.data
      console.log("%cRES | GET USER INFO", "color:white; background-color: green; padding: 0 5px", res)

      if(data) {
        const updatedUserInfo = yield trasform._identifyUserInfo(storeOgrn, data, action.payload.inn)
        yield put({
          type: GET_IDENTIFY_USER + SUCCESS,
          payload: {updatedUserInfo},
          loading: action.payload.id
        })
      } else {
        throw new TypeError("Ошибка получения данных!")
      }

    } catch (err){
      yield put({
        type: GET_IDENTIFY_USER + FAIL,
        error: action.payload.id
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
        loading: action.loading
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
      // yield delay(2000); const res = {ip: true, data: dataMock.ipCroinformMock.data, reqnum: 666}

      const html = res.data.html
      console.log("%cRES | GET CROINFORM USER INFO |", "color:white; background-color: green; padding: 0 5px", res)

      yield put({
        type: GET_CROINFORM_USER_INFO + SUCCESS,
        payload: {html},
        loading: action.loading
      })
    } catch (err){
      yield put({
        type: GET_CROINFORM_USER_INFO + FAIL,
        error: action.loading
      })
    }
  }
}

export const saga = function * () {
  yield spawn(loadCompanyInfoSaga)
  yield spawn(loadAffilatesListSaga)
  yield spawn(loadAffilatesUlSaga)
  yield spawn(loadDigestListSaga)
  yield spawn(addRiskFactorSaga)
  yield spawn(deleteRiskFactorSaga)
  yield spawn(identifyUserSaga)
  yield spawn(identifyUserInfoSaga)
  // yield all([
  //   identifyUserSaga(),
  //   identifyUserInfoSaga()
  // ])
}

export default openBillReducer