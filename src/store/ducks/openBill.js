import { Record, Map } from 'immutable'
import { createSelector } from 'reselect'
import { all, put, call, select, spawn, takeEvery } from 'redux-saga/effects'
import { trasform, getShortCompName, cloCss} from "../../services/utils"
// import { companyRes } from '../mock'
import { 
  getLoadCompanyInfo,
  getAffilatesList,
  getDigestList,
  getAddRiskFactor,
  getIdentifyUser,
  getDeleteRiskFactor,
  getIdentifyUserInfo,
  getRequestAffiliatesUl,
  getFsspInfo,
  getBlackStopList,
  getWhiteStopList,
  getStopListsUlInfo
} from '../../services/api'

/* Mock данные */
import { delay } from 'redux-saga/effects'
import { companyRes, identifyInfoMock, bicompactResMock, ipResMock, ipCroinformMock } from '../mock'
const dataMock = { companyRes, identifyInfoMock, bicompactResMock, ipResMock, ipCroinformMock }

// const dataMock = { companyRes }

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
export const GET_BLACK_STOP_LISTS = `${prefix}/GET_BLACK_STOP_LISTS`
export const GET_WHITE_STOP_LISTS = `${prefix}/GET_WHITE_STOP_LISTS`
export const LOAD_DIGEST_LIST = `${prefix}/LOAD_DIGEST_LIST`
export const ADD_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_IN_DIGEST_LIST`
export const GET_FSSP_INFO = `${prefix}/GET_FSSP_INFO`
export const GET_STOP_LISTS_UL_INFO = `${prefix}/GET_STOP_LISTS_UL_INFO`

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
  stopLists: new Map({}),
  fsspInfo: new Map({}),
  croinformResponse: new Map({}),
  selectedInfo: new Map({}),
  requestLoading: new Map({
    companyMainInfo: false, 
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    stopLists: new Map({}),
    fsspInfo: new Map({}),
    getAffilatesUl: new Map({}),
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  }),
  errors: new Map({
    companyMainInfo: false, 
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    stopLists: new Map({}),
    fsspInfo: new Map({}),
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
        .setIn(['errors', 'companyMainInfoUpdate'], { status: action.error.status, message: action.error.message, time: action.error.time })
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
      .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: true, name: action.loading.name})
      .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name})      
    case GET_AFFILATES_UL + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name}) 
    case GET_AFFILATES_UL + FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: true, name: action.loading.name})

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
        .setIn(['requestLoading', 'identifyUser', action.error.id], false)
        .setIn(['errors', 'identifyUser', action.error.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    case GET_CROINFORM_USER_INFO + START:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
        .setIn(['selectedInfo', action.loading], action.payload)
    case GET_CROINFORM_USER_INFO + SUCCESS:
      return state
        .set('companyResponse', action.updatedInfo)
        .setIn(['croinformResponse', action.loading], payload)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case GET_CROINFORM_USER_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], { status: action.error.status, message: action.error.message, time: action.error.time })

    case GET_FSSP_INFO + START:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], true)
        .setIn(['errors', 'fsspInfo', action.loading], false)
    case GET_FSSP_INFO + SUCCESS:
      return state
        .setIn(['fsspInfo', action.loading], payload.fssp)
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], false) 
    case GET_FSSP_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'fsspInfo'], false)
        .setIn(['errors', 'fsspInfo', action.loading], true)

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

    case GET_BLACK_STOP_LISTS + START:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], true)
        .setIn(['errors', 'stopLists', action.loading], false)
    case GET_BLACK_STOP_LISTS + SUCCESS:
      return state
        .set('companyResponse', payload)
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], false) 
    case GET_BLACK_STOP_LISTS + FAIL:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], true)

    case GET_STOP_LISTS_UL_INFO + START:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], true)
        .setIn(['errors', 'getStopListsUl'], false)
    case GET_STOP_LISTS_UL_INFO + SUCCESS:
      return state
        .set('companyResponse', payload)
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], false) 
    case GET_STOP_LISTS_UL_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], true)

    case GET_WHITE_STOP_LISTS + START:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], true)
        .setIn(['errors', 'stopLists', action.loading], false)
    case GET_WHITE_STOP_LISTS + SUCCESS:
      return state
        .set('companyResponse', payload)
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], false) 
    case GET_WHITE_STOP_LISTS + FAIL:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], true)

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
    payload: data,
    id: data.id
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
export const fsspSelector = state => state[moduleName].get('fsspInfo')
export const isIpSelector = state => state[moduleName].get('isIp')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
export const сroinformResSelector = state => state[moduleName].get('croinformResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const errorsSelector = state => state[moduleName].get('errors')

export const decodedCompanyResponse = createSelector( companyResSelector, (companyResponse) =>  companyResponse )
export const decodedFsspInfo = createSelector( fsspSelector, (fssp) =>  fssp )
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
    const { arbiter, fns, sanctions, isponlit_proizvodstva, spiski, spark_spiski, arbiter_other, stop_list } = companyResponse
    const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva, spiski, spark_spiski, arbiter_other, stop_list }
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
const loadCompanyInfoSaga = function * (action) {
  try {
    yield put({
      type: LOAD_COMPANY_INFO + UPDATE + START
    })
    // Запрос на получение основных данных о кампании
    // const res = yield call(getLoadCompanyInfo, action.inn)

    /* Mock данные о ЮЛ */
    yield delay(2000); const res = {...dataMock.bicompactResMock}
    /** Mock данные о ФЛ */
    // const res = {ip: true, data: dataMock.ipResMock.data, reqnum: 666}

    const data = res.data.company_info
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)
    const store = state => state[moduleName].get('companyResponse')
    const companyResponse = yield select(store)

    if(res.data.ip) {
      const updatedData = yield trasform._companySource_ip(companyResponse, data)
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum, 
        isIp: true,
        payload: {updatedData},
      })
      yield spawn(getStopListsUlSaga, action.inn)
    } else {
      const updatedData = yield trasform._get_company_info_companySource(companyResponse, data)
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum,
        isIp: false,
        payload: {updatedData},
      })
      yield spawn(getStopListsUlSaga, action.inn)
    }

  } catch (err){
    console.log('%cloadCompanyInfoSagaErr', cloCss.red, err)
    yield put({
      type: LOAD_COMPANY_INFO + UPDATE + FAIL,
      error: {
        status: true,
        id: action.payload.id, 
        time: Date.now(),
        message: "Ресурс занят, данные о кампании не получены, пожалуйста повторите запрос" 
      }
    })
  }
}

/* Поиск данных стоп-листов о ЮЛ */
const getStopListsUlSaga = function * (inn) {
  try {
    yield put({
      type: GET_STOP_LISTS_UL_INFO + START
    })

    /* Запрос данных о приемниках */
    const res = yield call(getStopListsUlInfo, inn)
    
    /* Получение данных из mock */
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const data = res.Response
    console.log("%cRES | GET STOP LIST UL",  cloCss.green, res)
    const store = state => state[moduleName].get('companyResponse')
    
    const companyResponse = yield select(store)
    const updatedData = yield trasform.stopListsUlInfo(companyResponse, data)

    yield put({
      type: GET_STOP_LISTS_UL_INFO + SUCCESS,
      // reqnum: res.reqnum,
      payload: updatedData,
    })
  } catch (err){
    console.log('%cgetStopListsUlSagaErr', cloCss.red, err)
    yield put({
      type: GET_STOP_LISTS_UL_INFO + FAIL,
    })
  }


}

/* Получение данных о связанных лицах */
const loadAffilatesListSaga = function * (action) {
  const store = state => state[moduleName].get('companyResponse')
  const storeInn = yield select(store)
  if(!action.isIp) {
    try {
      yield put({
        type: GET_AFFILATES_LIST + START
      })

      /* Запрос данных о приемниках */
      const res = yield call(getAffilatesList, action.id, storeInn.inn)
      
      /* Получение данных из mock */
      // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
      
      const data = res.data
      console.log("%cRES | GET AFFILATES LIST",  cloCss.green, res)
      const store = state => state[moduleName].get('companyResponse')
      
      const companyResponse = yield select(store)
      const updatedData = yield trasform.updateManagmentSource(companyResponse, data)

      yield put({
        type: GET_AFFILATES_LIST + SUCCESS,
        payload: {updatedData},
      })
    } catch (err){
      console.log('%cloadAffilatesListSagaErr', cloCss.red, err)
      yield put({
        type: GET_AFFILATES_LIST + FAIL,
      })
    }
  }
}

/* Получение данных о предшедственнниках и приемниках */
const loadAffilatesUlSaga = function * (action) {
  if(action.payload.updatedData.founders_ul.length) {
    yield all(action.payload.updatedData.founders_ul.map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
  if(action.payload.updatedData.heads_ul.length) {
    yield all(action.payload.updatedData.heads_ul.map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
  if(action.payload.updatedData.share_holders_ul.length) {
    yield all(action.payload.updatedData.share_holders_ul.map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
}

/* Получение данных по БД стоп-листов */
const loadStopListDataSaga = function * (action) {
  const store = state => state[moduleName].get('companyResponse')
  const storeReqnum = state => state[moduleName].get('reqnum')
  const storeState = yield select(store)
  const user = storeState.heads.filter(item => item.id === action.loading)[0]
  yield spawn(getFsspInfoSaga, yield select(storeReqnum), action, user)
  // Стоп-листы
  yield spawn(getBlackStopListSaga, user, action.payload)
  yield spawn(getWhiteStopListSaga, user, action.payload)
}

/* Поиск пользователя в стоп-листах по Дате рождения */
const getBlackStopListSaga = function * (user, action) {
  try {
    yield put({
      type: GET_BLACK_STOP_LISTS + START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(getBlackStopList, action)

    console.log("%cRES | GET BLACK STOP LISTS ",  cloCss.green, res)

    if(JSON.stringify(res.Response  !== '[]') && res.Status !== "Error") {
      const store = state => state[moduleName].get('companyResponse')
      const newStore = trasform.stop_lists(yield select(store), res.Response, user.id)

      yield put({
        type: GET_BLACK_STOP_LISTS + SUCCESS,
        payload: newStore,
        loading: user.id
      })
    } else if(res.Status === "Error") {
      console.log('%cgetBlackStopListSagaErr', cloCss.red, res.Description)
      yield put({
        type: GET_BLACK_STOP_LISTS + FAIL,
        loading: user.id
      })
    }

  } catch (err){
    console.log('%cgetBlackStopListSagaErr', cloCss.red, err)
    yield put({
      type: GET_BLACK_STOP_LISTS + FAIL,
      loading: user.id
    })
  }
}

/** Получение данных из белой БД (стоп-листы) */
const getWhiteStopListSaga = function * (user, action) {
  
  try {
    yield put({
      type: GET_WHITE_STOP_LISTS + START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(getWhiteStopList, action)

    console.log("%cRES | GET WHITE STOP LISTS ",  cloCss.green, res)
    if(JSON.stringify(res.Response  !== '[]' ) && res.Status !== "Error") {
      const store = state => state[moduleName].get('companyResponse')
      const newStore = trasform.stop_lists(yield select(store), res.Response, user.id)

      yield put({
        type: GET_WHITE_STOP_LISTS + SUCCESS,
        payload: newStore,
        loading: user.id
      })
    } else if(res.Status === "Error") {
      console.log('%cgetWhiteStopListSagaErr', cloCss.red, res.Description)
      yield put({
        type: GET_WHITE_STOP_LISTS + FAIL,
        loading: user.id
      })
    }

  } catch (err){
    console.log('%cgetWhiteStopListSagaErr', cloCss.red, err)
    yield put({
      type: GET_WHITE_STOP_LISTS + FAIL,
      loading: user.id
    })
  }
}

/* Запрос данныз по ФССП */
const getFsspInfoSaga = function * (reqnum, action, user) {
  try {
    yield put({
      type: GET_FSSP_INFO + START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(getFsspInfo, reqnum, action.payload)
    
    const fssp = res.data.html
    console.log("%cRES | GET FSSP INFO",  cloCss.green, res)

    yield put({
      type: GET_FSSP_INFO + SUCCESS,
      payload: {fssp},
      loading: user.id
    })
  } catch (err){
    console.log('%cgetFsspInfoSagaErr', cloCss.red, err)
    yield put({
      type: GET_FSSP_INFO + FAIL,
      loading: user.id
    })
  }
}

/* Получение данных о риск-факторах */
const loadDigestListSaga = function * () {
  const reqnum = state => state[moduleName].get('reqnum')
  const storeReqnum = yield select(reqnum)
  try {
    yield put({
      type: LOAD_DIGEST_LIST + START
    })

    /* Запрос данных для DigetsList */
    const res = yield call(getDigestList, storeReqnum)
    
    /* Получение данных из mock */
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const digest = res.data
    console.log("%cRES | LOAD DIGEST LIST",  cloCss.green, res)

    yield put({
      type: LOAD_DIGEST_LIST + SUCCESS,
      payload: {digest},
    })
  } catch (err){
    console.log('%cloadDigestListSagaErr', cloCss.red, err)
    yield put({
      type: LOAD_DIGEST_LIST + FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorSaga = function * (action) {
  const reqnum = state => state[moduleName].get('reqnum')
  const storeReqnum = yield select(reqnum)
  try {
    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(getAddRiskFactor, storeReqnum, action.payload)
    
    /* Получение данных из mock */
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const digest = res.data
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
      payload: {digest},
    })
  } catch (err){
    console.log('%caddRiskFactorSagaErr', cloCss.red, err)
    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorSaga = function * (action) {
  const reqnum = state => state[moduleName].get('reqnum')
  const storeReqnum = yield select(reqnum)
  try {
    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(getDeleteRiskFactor, storeReqnum, action.payload)
    
    /* Получение данных из mock */
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const digest = res.data
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
      payload: {digest},
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSagaErr', cloCss.red, err)
    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
    })
  }
}

const getRequestAffiliatesUlSaga = function * (inn, user) {
  try {
    yield put({
      type: GET_AFFILATES_UL + START,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })

    const store = state => state[moduleName]
    const storeState = yield select(store)

    /* Запрос данных о приемниках */
    const res = yield call(getRequestAffiliatesUl, storeState.get('reqnum'), inn)
    
    /* Получение данных из mock */
    // yield delay(2000); const res = {...dataMock.bicompactPCResMock}
    
    const data = res.data
    console.log("%cRES | GET CHECK AFFILATES UL",  cloCss.green, res)
    
    const companyRes = yield select(store)
    const updatedData = yield trasform.updateManagmentULSource(companyRes.get("companyResponse"), data, user)

    yield put({
      type: GET_AFFILATES_UL + SUCCESS,
      payload: {updatedData},
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  } catch (err){
    console.log('%cgetRequestAffiliatesUlSagaErr', cloCss.red, err)
    yield put({
      type: GET_AFFILATES_UL + FAIL,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  }
}

/* Идентификация пользователя */
const identifyUserSaga = function * (action) {
  const reqnum = state => state[moduleName].get('reqnum')
  const storeReqnum = yield select(reqnum)
  const companyState = state => state[moduleName].get('companyResponse')
  const storeCR = yield select(companyState)
  const isIP = state => state[moduleName].get('isIp')
  const storeIsIP = yield select(isIP)
  try {
    yield put({
      type: GET_IDENTIFY_USER + START,
      loading: action.id,
    })
    
    /* Запрос на идентификацию проверяемого объекта */
    // const res = yield call(getIdentifyUser, storeIsIP, storeReqnum, action.payload.user, storeCR)

    /** Mock данные о Идентификационных данных */
    yield delay(2000); const res = {ip: true, data: dataMock.identifyInfoMock, reqnum: 666}

    const data = res.data
    console.log("%cRES | GET USER INFO",  cloCss.green, res)

    if(data) {
      const updatedUserInfo = yield trasform.identifyUserInfo(storeCR, data, action.payload.user, action.id)
      yield put({
        type: GET_IDENTIFY_USER + SUCCESS,
        payload: {updatedUserInfo},
        loading: action.id
      })
    } else {
      throw new TypeError("Ошибка получения данных!")
    }

  } catch (err){
    console.log('%cidentifyUserSagaErr', cloCss.red, err)
    yield put({
      type: GET_IDENTIFY_USER + FAIL,
      error: {
        status: true,
        id: action.id, 
        time: Date.now(),
        message: "Ошибка идентификации пользователя, данные не получены" 
      }
    })
  }
  
}

/* Получение полной информации из источников об проверяемом пользователе */
const identifyUserInfoSaga = function * (action) {
  const reqnum = state => state[moduleName].get('reqnum')
  const storeReqnum = yield select(reqnum)

  try {
    yield put({
      type: GET_CROINFORM_USER_INFO + START,
      loading: action.loading,
      payload: action.payload
    })

    /* Переключение на mock данные */
    // const res = yield call(getIdentifyUserInfo, storeReqnum, action.payload)

    /** Mock данные о Идентификационных данных */
    yield delay(2000); const res = {ip: true, data: dataMock.ipCroinformMock.data, reqnum: 666}

    console.log("%cRES | GET CROINFORM USER INFO |", cloCss.green, res)
    const html = res.data.html
    const lists = res.data.lists
    const vector = res.data.parse_ci_request.vektor_fl
    const companyState = state => state[moduleName].get('companyResponse')
    const storeCR = yield select(companyState)
    const updatedInfo = yield trasform.updateSelectedUserInfo(storeCR, action.payload, action.loading)
    console.log('updatedInfo', updatedInfo)

    yield put({
      type: GET_CROINFORM_USER_INFO + SUCCESS,
      payload: {html, lists, vector},
      updatedInfo,
      loading: action.loading
    })
  } catch (err){
    console.log('%cidentifyUserInfoSagaErr', cloCss.red, err)
    const { FirstName, MiddleName, SurName } = action.payload
    yield put({
      type: GET_CROINFORM_USER_INFO + FAIL,
      loading: action.loading,
      error: {
        status: true,
        time: Date.now(),
        message: `Данные полной проверки "${SurName} ${FirstName} ${MiddleName}" не получены`
      }
    })
  }

}

export const saga = function * () {
  yield takeEvery(LOAD_COMPANY_INFO, loadCompanyInfoSaga)
  yield takeEvery(GET_IDENTIFY_USER, identifyUserSaga)
  yield takeEvery(GET_CROINFORM_USER_INFO, identifyUserInfoSaga)
  yield takeEvery(DELETE_RISK_FACTOR_IN_DIGEST_LIST, deleteRiskFactorSaga)
  yield takeEvery(LOAD_COMPANY_INFO + UPDATE + SUCCESS, loadAffilatesListSaga)
  yield takeEvery(LOAD_COMPANY_INFO + UPDATE + SUCCESS, loadDigestListSaga)
  yield takeEvery(GET_AFFILATES_LIST + SUCCESS, loadAffilatesUlSaga)
  yield takeEvery(ADD_RISK_FACTOR_IN_DIGEST_LIST, addRiskFactorSaga)
  yield takeEvery(GET_CROINFORM_USER_INFO, loadStopListDataSaga)
}

export default openBillReducer