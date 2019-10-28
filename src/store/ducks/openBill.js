import { createSelector } from 'reselect'
import { Record, Map, OrderedMap } from 'immutable'
import { all, put, call, select, spawn, takeEvery } from 'redux-saga/effects'
import { 
  trasform, 
  clearStopListsArr, 
  getShortCompName,
  dowloadHtmlFile, 
  cloCss, 
  uuid 
} from "../../services/utils"
import { companyRes } from '../mock'
import { API } from '../../services/api'
import config from '../../config'

/** Constants */
export const moduleName = 'openBill'
export const prefix = `${config.appName}/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`
export const GET_IDENTIFY_USER = `${prefix}/GET_IDENTIFY_USER`
export const DOWNLOAD_REPORT_FILE = `${prefix}/DOWNLOAD_REPORT_FILE`
export const UPDATE_SELECTED_USER_INFO = `${prefix}/UPDATE_SELECTED_USER_INFO`
export const GET_CROINFORM_USER_INFO = `${prefix}/GET_CROINFORM_USER_INFO`
export const ADD_USER_TO_CHECK_LIST = `${prefix}/ADD_USER_TO_CHECK_LIST`
export const GET_AFFILATES_LIST = `${prefix}/GET_AFFILATES_LIST`
export const GET_AFFILATES_UL = `${prefix}/GET_AFFILATES_UL`
export const GET_BLACK_STOP_LISTS = `${prefix}/GET_BLACK_STOP_LISTS`
export const GET_WHITE_STOP_LISTS = `${prefix}/GET_WHITE_STOP_LISTS`
export const LOAD_DIGEST_LIST = `${prefix}/LOAD_DIGEST_LIST`
export const ADD_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_IN_DIGEST_LIST`
export const EDIT_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/EDIT_RISK_FACTOR_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_IN_DIGEST_LIST`
export const ADD_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const GET_FSSP_INFO = `${prefix}/GET_FSSP_INFO`
export const GET_STOP_LISTS_UL_INFO = `${prefix}/GET_STOP_LISTS_UL_INFO`
export const GET_RISK_FACTORS_FL_INFO = `${prefix}/GET_RISK_FACTORS_FL_INFO`
export const GET_DOCUMENTS = `${prefix}/GET_DOCUMENTS`
export const GET_DOCUMENT_ITEM = `${prefix}/GET_DOCUMENT_ITEM`

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
  risksSrc: [],
  companyResponse: OrderedMap({ 
    ...companyRes,
    historyIdentify: [],
    key: uuid() 
  }),
  croinformInfoFl: new Map({}),
  identifyInfoFl: new Map({}),
  selectedInfoFl: new Map({}),
  fsspInfo: new Map({}),
  stopLists: new Map({}),
  riskFactors: new Map({}),
  timeRequest: new Map({}),
  requestLoading: new Map({
    companyMainInfo: false,
    getDocuments: false,
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    getDocumentItem: new Map({}),
    getRiskFactorsFl: new Map({}),
    stopLists: new Map({}),
    fsspInfo: new Map({}),
    getAffilatesUl: new Map({}),
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  }),
  errors: new Map({
    companyMainInfo: false, 
    getDocuments: false,
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    getDocumentItem: new Map({}),
    getRiskFactorsFl: new Map({}),
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
    // Сохранение ИНН запроса
    case ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    // Обновление основных данных по кампании
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

    // Сохранение данных об аффилированных лица
    case GET_AFFILATES_LIST + START:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], true)
        .setIn(['errors', 'getAffilatesList'], false)      
    case GET_AFFILATES_LIST + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .set('selectedInfoFl', payload.selectedInfo)
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
        .setIn(['companyResponse', 'heads'], payload.updatedData)
        .set('selectedInfoFl', payload.selectedInfo)
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name}) 
    case GET_AFFILATES_UL + FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: true, name: action.loading.name})

    case GET_IDENTIFY_USER + START:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'identifyUser', action.loading], true)
        .setIn(['errors', 'identifyUser', action.loading], false)
    case GET_IDENTIFY_USER + SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload.updatedUserInfo)
        .setIn(['identifyInfoFl', action.loading], action.info)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'identifyUser', action.loading], false)
        .setIn(['errors', 'identifyUser', action.loading], false) 
    case GET_IDENTIFY_USER + FAIL:
      return state
        .setIn(['requestLoading', 'identifyUser', action.error.id], false)
        .setIn(['errors', 'identifyUser', action.error.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Сохранение данных введеных пользователем
    case UPDATE_SELECTED_USER_INFO + SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['errors', 'updateSelectedUserInfo'], false) 
    case UPDATE_SELECTED_USER_INFO + FAIL:
      return state
        .setIn(['errors', 'updateSelectedUserInfo'], action.error.status)

    case GET_CROINFORM_USER_INFO + START:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
    case GET_CROINFORM_USER_INFO + SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['croinformInfoFl', action.loading], action.croinform)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case GET_CROINFORM_USER_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], { status: action.error.status, message: action.error.message, time: action.error.time })

    case LOAD_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'digestList'], true)
        .setIn(['errors', 'digestList'], false)
    case LOAD_DIGEST_LIST + SUCCESS:
      return state
        .set('risksSrc', action.risksSrc)
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], false) 
    case LOAD_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], true)

    // Добавление нового риск-фактора в таблицу
    case ADD_RISK_FACTOR_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], true)
        .setIn(['errors', 'addRistFactorInDigestList'], false)
    case ADD_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], false) 
    case ADD_RISK_FACTOR_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], true)

    // Редактирование выбранного риск фактора
    case EDIT_RISK_FACTOR_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case EDIT_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case EDIT_RISK_FACTOR_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление выбранного риск-фактора из таблицы
    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case DELETE_RISK_FACTOR_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Получение данных о риск-факторах по проверяемому физику
    case GET_RISK_FACTORS_FL_INFO + START:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], true)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false)
    case GET_RISK_FACTORS_FL_INFO + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false) 
    case GET_RISK_FACTORS_FL_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], true)

    // Добавление нового риск фактора в дайджест лист
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], true)
        .setIn(['errors', 'addRistFactorInDigestList'], false)
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false) 
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], false) 
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], true)

    // Редактирование риск-фактора из дайджест листа
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление риск фактора из дайджест листа
    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Получение данных о вхождении в стоплисты ЮЛ кампании
    case GET_STOP_LISTS_UL_INFO + START:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], true)
        .setIn(['errors', 'getStopListsUl'], false)
    case GET_STOP_LISTS_UL_INFO + SUCCESS:
      return state
        .setIn(['companyResponse', 'stop_list'], payload)
        .setIn(['stopLists', action.loading], payload)
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], false) 
    case GET_STOP_LISTS_UL_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], true)

    // Загрузка списка приложенных документов
    case GET_DOCUMENTS + START:
      return state
        .setIn(['requestLoading', 'getDocuments'], true)
        .setIn(['errors', 'getDocuments'], false)
    case GET_DOCUMENTS + SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], false) 
    case GET_DOCUMENTS + FAIL:
      return state
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], true)

    // Загрузка документа с сервера
    case GET_DOCUMENT_ITEM + START:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], true)
        .setIn(['errors', 'getDocumentItem', action.loading], false)
    case GET_DOCUMENT_ITEM + SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], false) 
    case GET_DOCUMENT_ITEM + FAIL:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], true)

    case GET_BLACK_STOP_LISTS + START:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], true)
        .setIn(['errors', 'stopLists', action.loading], false)
    case GET_BLACK_STOP_LISTS + SUCCESS:
      return state
        .setIn(['stopLists', action.loading], action.stopLists)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], false) 
    case GET_BLACK_STOP_LISTS + FAIL:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], true)

    // Получение FSSP данных об проверяемом объекте
    case GET_FSSP_INFO + START:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], true)
        .setIn(['errors', 'fsspInfo', action.loading], false)
    case GET_FSSP_INFO + SUCCESS:
      return state
        .setIn(['fsspInfo', action.loading], action.fsspInfo)
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], false) 
    case GET_FSSP_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], true)

    // Добавление нового лица в проверку
    case ADD_USER_TO_CHECK_LIST:
      return state
        .mergeDeepIn(['companyResponse', 'heads'], [payload.newUser])

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
// Загрузка основных перевоначальных данных о кампании
export const loadCompanyInfo = inn => {
  return {
    type: LOAD_COMPANY_INFO,
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
export const addNewUserToCheackList = newUser => {
  console.log('newUser', newUser)
  return {
    type: ADD_USER_TO_CHECK_LIST,
    payload: {newUser},
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
export const editRiskFactor = factor => {
  return {
    type: EDIT_RISK_FACTOR_IN_DIGEST_LIST,
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
// Добавление нового риск-фактора
export const addRiskFactorFl = (factor, id) => {
  return {
    type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}
// Добавление нового риск-фактора
export const editRiskFactorFl = (factor, id) => {
  return {
    type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}
// Добавление нового риск-фактора
export const deleteRiskFactorFl = (factor, id) => {
  return {
    type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}
// Обновление введенных идентификационных данных проверяемого лица
export const updateUserSelectedInfo = data => {
  return {
    type: UPDATE_SELECTED_USER_INFO,
    payload: data,
    id: data.id
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
// Проверка юзера через Croinform
export const actionGetUserCroinformInfo = (user, id) => {
  return {
    type: GET_CROINFORM_USER_INFO,
    payload: {...user},
    loading: id
  }
}
// Проверка юзера через Croinform
export const getDocument = doc => {
  return {
    type: GET_DOCUMENT_ITEM,
    payload: doc
  }
}
// Проверка юзера через Croinform
export const updateDigets = () => {
  return {
    type: LOAD_DIGEST_LIST
  }
}
// Проверка юзера через Croinform
export const updateDigetsFl = (user, reqnum) => {
  return {
    type: GET_RISK_FACTORS_FL_INFO,
    user,
    reqnum
  }
}
// Формирование и загрузка отчета по проверке
export const downloadReport = ({checkType, key}) => {
  return {
    type: DOWNLOAD_REPORT_FILE,
    checkType,
    key
  }
}

/** Selectors */
const storeInn = state => state[moduleName].getIn(['companyResponse', 'inn'])
const storeKey = state => state[moduleName].getIn(['companyResponse', 'key'])
const storeDoc = state => state[moduleName].getIn(['companyResponse','documents'])
const storeHistoryIdentify = state => state[moduleName].getIn(['companyResponse', 'historyIdentify'])
const storeLoading = state => state[moduleName].getIn(["requestLoading", "getRiskFactorsFl"])

export const storeStateSelector = state => state[moduleName]
export const companyResSelector = state => state[moduleName].get('companyResponse').toJS()
export const companyImmutableResSelector = state => state[moduleName].get('companyResponse')
export const documentsSelector = state => state[moduleName].getIn(['companyResponse', 'documents'])
export const digetsListSelector = state => state[moduleName].get('digestList')
export const risksSrcSelector = state => state[moduleName].get('risksSrc')
export const renderDataSelector = state => state[moduleName].get('renderData')
export const fsspSelector = state => state[moduleName].get('fsspInfo')
export const isIpSelector = state => state[moduleName].get('isIp')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
export const сroinformResSelector = state => state[moduleName].get('croinformResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const errorsSelector = state => state[moduleName].get('errors')
export const companySrcSelector = state => state[moduleName].get('companyResponse')
export const risksListSelector = state => state[moduleName].get('risksList')
export const mainDigetsSelector = state => state[moduleName].get('riskFactors')
export const riskFactorsSelector = state => state[moduleName].get('riskFactors')
export const storeHeadsSelector = state => state[moduleName].getIn(['companyResponse', 'heads'])
export const identifyInfoFlSelector = state => state[moduleName].get('identifyInfoFl')
export const selectedInfoFlSelector = state => state[moduleName].get('selectedInfoFl')
export const croinformInfoFlSelector = state => state[moduleName].get('croinformInfoFl')
export const fsspInfoSelector = state => state[moduleName].get('fsspInfo')
export const stopListsSelector = state => state[moduleName].get('stopLists')
export const timeRequestSelector = state => state[moduleName].get('timeRequest')
export const riskFactorsItemSelector = (state, keyId) => state[moduleName].getIn(['riskFactors', keyId], {digets: [], history: []})
export const keySelector = (state, key) => key

export const storeTimeRequest = createSelector( timeRequestSelector, timeRequest =>  timeRequest )
export const storeIdentifyInfoFl = createSelector( identifyInfoFlSelector, identifyInfo =>  identifyInfo )
export const storeFsspInfo = createSelector( fsspInfoSelector, fsspInfo =>  fsspInfo )
export const storeStopLists = createSelector( stopListsSelector, stopLists =>  stopLists )
export const storeSelectedInfoFl = createSelector( selectedInfoFlSelector, selectedInfo =>  selectedInfo )
export const storeCroinformInfoFl = createSelector( croinformInfoFlSelector, croinformInfo =>  croinformInfo )
export const storeRisksSrc = createSelector( risksSrcSelector, risksSrc =>  risksSrc )
export const storeRiskFactors = createSelector( riskFactorsSelector, risks =>  risks )

export const ebgHeads = createSelector( storeHeadsSelector, heads =>  heads )
export const decodedCompanyResponse = createSelector( companyResSelector, companyResponse =>  companyResponse )
export const storeRiskFactorsItem = createSelector( riskFactorsItemSelector, riskItem =>  riskItem )
export const decodedRisksList = createSelector( risksListSelector, risksList =>  risksList )
export const decodedDocuments = createSelector( documentsSelector, documents =>  documents )
export const decodedFsspInfo = createSelector( fsspSelector, fssp =>  fssp )
export const decodedDigetsList = createSelector( digetsListSelector, digets =>  digets )
export const decodedisIp = createSelector( isIpSelector, isIp =>  isIp )
export const decodedСroinformResponse = createSelector( сroinformResSelector, сroinformRes =>  сroinformRes )
export const decodedCompanyName = createSelector( nameCompanySelector, companyName =>  companyName )
export const decodedReqnum = createSelector( reqnumSelector, reqnum => reqnum )
export const decodedInn = createSelector( innSelector, inn => inn )
export const decodedErrors = createSelector( errorsSelector, errors => errors )
export const decodedRenderData = createSelector( renderDataSelector, renderData => renderData )
export const decodedRequestLoading = createSelector( requestLoadingSelector, requestLoading => requestLoading )

export const storeMainDigest = createSelector( mainDigetsSelector, riskFactors =>  trasform.getMainDigest(riskFactors) )
export const storeHeadItem = createSelector(storeHeadsSelector, keySelector, (heads, keyId) => heads.find((value, key) => value === keyId))

export const decodedMainCompanySource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const  companySource = companyResponse.filterNot((value, key) => 
      key === "heads" ||
      key === "management_companies" ||
      key === "founders_fl" ||
      key === "founders_ul" ||
      key === "befenicials" ||
      key === "arbiter" ||
      key === "fns" ||
      key === "inn" ||
      key === "ogrn" ||
      key === "name" ||
      key === "full_name" ||
      key === "sanctions" ||
      key === "fl" ||
      key === "ul" ||
      key === "heads_ul" ||
      key === "heads_fl" ||
      key === "share_holders_fl" ||
      key === "share_holders_ul" ||
      key === "leaders_list" ||
      key === "stop_list" ||
      key === "spiski" ||
      key === "spark_spiski" ||
      key === "arbiter_other" ||
      key === "birthdate" ||
      key === "birth_place" ||
      key === "sex" ||
      key === "isponlit_proizvodstva"
    ).toJS()
    return trasform.companySource(companySource)
  }
)
export const decodedCompanySrc = createSelector(
  companySrcSelector, companyResponse => {
    const companySrc = companyResponse.filter((value, key) => 
    key === "inn" ||
    key === "ogrn" ||
    key === "name" ||
    key === "full_name"
  ).toJS()
    return companySrc
  }
)

export const digetsSrc = createSelector(
  companySrcSelector, companyResponse => {
    const companySrc = companyResponse.filter((value, key) => 
    key === "inn" ||
    key === "ogrn" ||
    key === "name" ||
    key === "heads" ||
    key === "full_name"
  ).toJS()
    return companySrc
  }
)
export const decodedRiskSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const riskSource = companyResponse.filter((value, key) => 
    key === "arbiter" ||
    key === "fns" ||
    key === "sanctions" ||
    key === "isponlit_proizvodstva" ||
    key === "spiski" ||
    key === "spark_spiski" ||
    key === "arbiter_other" ||
    key === "stop_list"
  ).toJS()
    return trasform.riskSource(riskSource)
  }
)
export const decodedManagementSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const managementSource = companyResponse.filter((value, key) => key === "heads").toJS()
    return trasform.getHeadsSrc(managementSource)
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
    const res = yield call(API.getLoadCompanyInfo, action.inn, 2)
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)

    if(res.data.ip && res.status.success) {
      yield call(loadDigestListSaga)
      const updatedData = yield call(trasform.updateIPComSrc, yield select(decodedCompanyResponse), {
        ...res.data.company_info, 
        history_identify: res.data.history_identify
      })
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum, 
        isIp: true,
        payload: {updatedData},
      })
      yield spawn(loadAffilatesListSaga)
      yield spawn(getStopListsUlSaga, updatedData.get("inn"), res.reqnum)
      yield spawn(getDocumentsSaga, res.reqnum, action.inn)
      if(updatedData.get("heads").length) {
        yield all(updatedData.get("heads").map(item =>  spawn(getRiskFactorsFlSaga, {
          user: item,
          reqnum: res.reqnum
        })))
      }
      yield call(loadDigestListSaga)
    } else if(!res.data.ip && res.status.success) {
      yield call(loadDigestListSaga)
      const updatedData = yield call(trasform.updateComSrc, yield select(decodedCompanyResponse), {
        ...res.data.company_info, 
        history_identify: res.data.history_identify
      }, res.reqnum)

      if(updatedData.get("heads").length) {
        yield all(updatedData.get("heads").map(item =>  spawn(getRiskFactorsFlSaga, {
          user: item,
          reqnum: res.reqnum
        })))
      }

      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum,
        isIp: false,
        payload: {updatedData},
      })
      yield spawn(loadAffilatesListSaga)
      yield spawn(getStopListsUlSaga, updatedData.get("inn"), res.reqnum)
      yield spawn(getDocumentsSaga, res.reqnum, action.inn)
      yield call(loadDigestListSaga)
    } else if(!res.status.success) {
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + FAIL,
        error: {
          status: true,
          time: Date.now(),
          message: "Данные о кампании не получены, пожалуйста повторите запрос" 
        }
      })
    }

  } catch (err){
    console.log('%cloadCompanyInfoSaga@Err', cloCss.red, err)
    yield put({
      type: LOAD_COMPANY_INFO + UPDATE + FAIL,
      error: {
        status: true,
        time: Date.now(),
        message: "Данные о кампании не получены, пожалуйста повторите запрос" 
      }
    })
  }
}

/* Поиск исторических данных риск-факторов о ЮЛ */
const getRiskFactorsNewUserSaga = function * ({payload: {newUser: user}}) {
  const factors = yield select(storeLoading)
  if(factors.has(user.id)) return
  try {
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + START,
      loading: user.id
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getRiskFactorsFl, yield select(decodedReqnum), user, 2)
    console.log("%cRES | GET RISK FACTORS FL",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(ebgHeads),
      factors: res.data, 
      id: user.id
    })

    yield put({
      type: GET_RISK_FACTORS_FL_INFO + SUCCESS,
      riskFactors: riskFactors,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetRiskFactorsFlSaga@Err', cloCss.red, err)
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + FAIL,
      loading: user.id
    })
  }
}

/* Поиск данных стоп-листов о ЮЛ */
const getStopListsUlSaga = function * (ulinn, reqnum) {
  try {
    yield put({
      type: GET_STOP_LISTS_UL_INFO + START
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getStopLists, { ulinn, type: 'ul', method: 'bases' }, reqnum, 2)
    console.log("%cRES | GET STOP LIST UL",  cloCss.green, res)
    const clearedData = res.data && res.data.length ? clearStopListsArr(res.data) : []

    yield put({
      type: GET_STOP_LISTS_UL_INFO + SUCCESS,
      payload: clearedData,
      loading: yield select(storeKey)
    })
  } catch (err){
    console.log('%cgetStopListsUlSaga@Err', cloCss.red, err)
    yield put({
      type: GET_STOP_LISTS_UL_INFO + FAIL,
    })
  }
}

/* Поиск данных стоп-листов о ЮЛ */
const getDocumentItemSaga = function * (action) {
  try {
    yield put({
      type: GET_DOCUMENT_ITEM + START,
      loading: action.payload.xhdoc
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getDocumentItem, yield select(decodedReqnum), action.payload.xhdoc)
    console.log("%cRES | GET DOCUMENT",  cloCss.green, res)

    const updatedData = yield call(trasform.updateDocuments, yield select(storeDoc), res, action.payload.xhdoc)

    yield put({
      type: GET_DOCUMENT_ITEM + SUCCESS,
      payload: updatedData,
      loading: action.payload.xhdoc
    })
  } catch (err){
    console.log('%getDocumentItem@Saga', cloCss.red, err)
    yield put({
      type: GET_DOCUMENT_ITEM + FAIL,
      loading: action.payload.xhdoc
    })
  }
}

/* Получение данных о связанных лицах */
const loadAffilatesListSaga = function * () {
  const isIp = yield select(decodedisIp)
  if(!isIp) {
    try {
      yield put({
        type: GET_AFFILATES_LIST + START
      })

      /* Запрос данных о приемниках */
      const res = yield call(API.getAffilatesList, yield select(decodedReqnum), yield select(storeInn), 2)
      console.log("%cRES | GET AFFILATES LIST",  cloCss.green, res)

      const updatedData = yield call(trasform.updateManagmentSrc, yield select(decodedCompanyResponse), res.data)
      const selectedInfo = yield call(trasform.historySelectedInfo, {
        prevHeads: yield updatedData.get("heads"), 
        historyIdentify: yield select(storeHistoryIdentify), 
        storeSelInfoFl: yield select(storeSelectedInfoFl)
      })

      if(updatedData.get("heads").length) {
        yield all(updatedData.get("heads").map(item =>  spawn(getRiskFactorsFlSaga, {
          user: item,
          reqnum: res.reqnum
        })))
      }

      yield put({
        type: GET_AFFILATES_LIST + SUCCESS,
        payload: {
          updatedData,
          selectedInfo
        },
      })
      yield spawn(loadAffilatesUlSaga, updatedData)
    } catch (err){
      console.log('%cloadAffilatesListSaga@Err', cloCss.red, err)
      yield put({
        type: GET_AFFILATES_LIST + FAIL,
      })
    }
  }
}

/* Получение данных о предшедственнниках и приемниках */
const loadAffilatesUlSaga = function * (action) {
  if(action.get("founders_ul").length) {
    yield all(action.get("founders_ul").map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
  if(action.get("heads_ul").length) {
    yield all(action.get("heads_ul").map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
  if(action.get("share_holders_ul").length) {
    yield all(action.get("share_holders_ul").map(item => {
      if(item.inn) return spawn(getRequestAffiliatesUlSaga, item.inn, item)
      else return item
    }))
  }
}

/* Получение данных по БД стоп-листов */
const loadStopListDataSaga = function * (action) {
  const heads = yield select(ebgHeads)
  const user = heads.find(item => item.id === action.loading)
  yield spawn(getFsspInfoSaga, yield select(decodedReqnum), action, user)
  // Стоп-листы
  yield spawn(getStopListSaga, user, action.payload)
}

/* Поиск пользователя в стоп-листах по Дате рождения */
const getStopListSaga = function * (user, action) {
  try {
    yield put({
      type: GET_BLACK_STOP_LISTS + START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getStopListFl, action, yield select(decodedReqnum), 2)
    console.log("%cRES | GET BLACK STOP LISTS ",  cloCss.green, res)

    if(res.data && res.data.length && res.Status !== "Error") {
      const stopLists = yield call(trasform.updateStopListArr, res.data)
      yield put({
        type: GET_BLACK_STOP_LISTS + SUCCESS,
        timeRequest: Date.now(),
        stopLists,
        loading: user.id
      })
    } else if(res.Status === "Error") {
      console.log('%cgetBlackStopListSaga@Err', cloCss.red, res.Description)
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

/* Получение данных о риск-факторах */
const loadDigestListSaga = function * () {
  try {
    yield put({
      type: LOAD_DIGEST_LIST + START
    })

    /* Запрос данных для DigetsList */
    const res = yield call(API.getDigestList, yield select(decodedReqnum), 2)
    console.log("%cRES | LOAD DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(storeInn), 
        name: yield select(decodedCompanyName)
      }
    })

    yield put({
      type: LOAD_DIGEST_LIST + SUCCESS,
      risksSrc: res.data.risks,
      riskFactors: riskFactors,
      loading: yield select(storeKey)
    })
  } catch (err){
    console.log('%cloadDigestListSaga@Err', cloCss.red, err)
    yield put({
      type: LOAD_DIGEST_LIST + FAIL,
    })
  }
}

/* Поиск исторических данных риск-факторов о ЮЛ */
const getRiskFactorsFlSaga = function * ({user, reqnum}) {
  try {
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + START,
      loading: user.id
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getRiskFactorsFl, reqnum, user, 2)
    console.log("%cRES | GET RISK FACTORS FL",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(ebgHeads),
      factors: res.data, 
      id: user.id
    })

    yield put({
      type: GET_RISK_FACTORS_FL_INFO + SUCCESS,
      riskFactors: riskFactors,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetRiskFactorsFlSaga@Err', cloCss.red, err)
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + FAIL,
      loading: user.id
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactor, yield select(decodedReqnum), action.payload, 2)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(storeInn), 
        name: yield select(decodedCompanyName)
      }
    })

    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(storeKey)
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: ADD_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: EDIT_RISK_FACTOR_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.editRiskFactorRequest, yield select(decodedReqnum), action.payload)
    console.log("%cRES | EDIT RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(storeInn), 
        name: yield select(decodedCompanyName)
      }
    })

    yield put({
      type: EDIT_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(storeKey)
    })
  } catch (err){
    console.log('%editRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: EDIT_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactor, yield select(decodedReqnum), action.payload)
    console.log("%cRES | DELETE RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(storeInn), 
        name: yield select(decodedCompanyName)
      }
    })

    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(storeKey)
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: DELETE_RISK_FACTOR_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactorFl, yield select(decodedReqnum), action.payload, 2)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.editRiskFactorFlRequest, yield select(decodedReqnum), action.payload, 2)
    console.log("%cRES | EDIT RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL,
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactorFl, yield select(decodedReqnum), action.payload)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL,
    })
  }
}

const getRequestAffiliatesUlSaga = function * (inn, user) {
  try {
    yield put({
      type: GET_AFFILATES_UL + START,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getRequestAffiliatesUl, yield select(decodedReqnum), inn, 2)
    console.log("%cRES | GET CHECK AFFILATES UL",  cloCss.green, res)

    const updatedData = yield call(trasform.updateManagmentULSrc, yield select(ebgHeads), res.data, user)

    if(updatedData.length) {
      yield all(updatedData.map(item =>  spawn(getRiskFactorsFlSaga, {
        user: item,
        reqnum: res.reqnum
      })))
    }
    const selectedInfo = yield call(trasform.historySelectedInfo, {
      prevHeads: updatedData, 
      historyIdentify: yield select(storeHistoryIdentify), 
      storeSelInfoFl: yield select(decodedCompanyResponse)
    })

    yield put({
      type: GET_AFFILATES_UL + SUCCESS,
      payload: {
        updatedData,
        selectedInfo
      },
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  } catch (err){
    console.log('%cgetRequestAffiliatesUlSaga@Err', cloCss.red, err)
    yield put({
      type: GET_AFFILATES_UL + FAIL,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  }
}

/* Идентификация пользователя */
const updateUserSelectedInfoSaga = function * (action) {
  try {
    yield put({
      type: UPDATE_SELECTED_USER_INFO + SUCCESS,
      selected: action.payload.user,
      loading: action.id
    })

  } catch (err){
    console.log('%cupdateUserSelectedInfoSaga@Err', cloCss.red, err)
    yield put({
      type: UPDATE_SELECTED_USER_INFO + FAIL,
      error: {
        status: true,
        id: action.id, 
        time: Date.now(),
        message: "Ошибка сохранения введенных данных" 
      }
    })
  }
}

/* Идентификация пользователя */
const identifyUserSaga = function * (action) {
  try {
    yield put({
      type: GET_IDENTIFY_USER + START,
      selected: action.payload.user,
      loading: action.id
    })

    /* Запрос на идентификацию проверяемого объекта */
    const res = yield call(API.getIdentifyUser, yield select(decodedisIp), yield select(decodedReqnum), action.payload.user)
    console.log("%cRES | GET USER INFO",  cloCss.green, res)

    if(res.data) {
      yield put({
        type: GET_IDENTIFY_USER + SUCCESS,
        info: yield call(trasform.updateIdentifyInfo, res.data),
        timeRequest: Date.now(),
        loading: action.id
      })
    } else {
      throw new TypeError("Ошибка получения данных!")
    }

  } catch (err){
    console.log('%cidentifyUserSaga@Err', cloCss.red, err)
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
const getCroinformInfoSaga = function * (action) {
  try {
    yield put({
      type: GET_CROINFORM_USER_INFO + START,
      selected: action.payload,
      loading: action.loading,
    })

    /* Переключение на mock данные */
    const res = yield call(API.getIdentifyUserInfo, yield select(decodedReqnum), action.payload, 2)
    console.log("%cRES | GET CROINFORM USER INFO |", cloCss.green, res)

    const croinform = yield call(trasform.croinformInfoResponse,
      {
        html: res.data.html,
        lists: res.data.lists,
        vector: res.data.parse_ci_request.vektor_fl
      }
    )

    yield put({
      type: GET_CROINFORM_USER_INFO + SUCCESS,
      timeRequest: Date.now(),
      croinform,
      loading: action.loading
    })

    const heads = yield select(ebgHeads)

    yield call(loadStopListDataSaga, action)
    yield call(getRiskFactorsFlSaga, {
      user: yield heads.find(item => item.id === action.loading),
      reqnum: res.reqnum
    })
  } catch (err){
    console.log('%cgetCroinformInfoSaga@Err', cloCss.red, err)
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

/* Запрос данныз по ФССП */
const getFsspInfoSaga = function * (reqnum, action, user) {
  try {
    yield put({
      type: GET_FSSP_INFO + START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getFsspInfo, reqnum, action.payload, 2)
    console.log("%cRES | GET FSSP INFO",  cloCss.green, res)

    const fsspInfo = yield call(trasform.clearedFsspInfo, res.data.html)

    yield put({
      type: GET_FSSP_INFO + SUCCESS,
      fsspInfo,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetFsspInfoSaga@Err', cloCss.red, err)
    yield put({
      type: GET_FSSP_INFO + FAIL,
      loading: user.id
    })
  }
}

/* Поиск приклепленных к проверке документов */
const getDocumentsSaga = function * (reqnum, inn) {
  try {
    yield put({
      type: GET_DOCUMENTS + START
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getDocuments, reqnum, inn)
    console.log("%cRES | GET DOCUMENTS",  cloCss.green, res)

    yield put({
      type: GET_DOCUMENTS + SUCCESS,
      payload: res.data,
    })
  } catch (err){
    console.log('%getDocuments@Saga', cloCss.red, err)
    yield put({
      type: GET_DOCUMENTS + FAIL,
    })
  }
}

/* Сохранение отчета по результатам проверки в виде HTML файла */
const downloadReportFileSaga = function * (action) {
  try {
    yield put({
      type: DOWNLOAD_REPORT_FILE + START
    })

    /* Формирование и сохранение отчета по данным на проверяемый объект */
    if(action.checkType) {
      // Для сохранения дайджеста по физическому лицу
      yield call(dowloadHtmlFile, {
        isFl: true,
        info: (yield select(ebgHeads)).find(item => item.id === action.key).fio,
        identify:  (yield select(identifyInfoFlSelector)).has(action.key) ? (yield select(identifyInfoFlSelector)).get(action.key).html : null,
        croinform:  (yield select(croinformInfoFlSelector)).has(action.key) ? (yield select(croinformInfoFlSelector)).get(action.key).html : null,
        lists: (yield select(croinformInfoFlSelector)).has(action.key) ? (yield select(croinformInfoFlSelector)).get(action.key).lists : null,
        vector:  (yield select(croinformInfoFlSelector)).has(action.key) ? (yield select(croinformInfoFlSelector)).get(action.key).vector : null,
        stopLists: (yield select(stopListsSelector)).has(action.key) ? (yield select(stopListsSelector)).get(action.key) : null,
        fsspInfo: (yield select(fsspInfoSelector)).has(action.key) ? (yield select(fsspInfoSelector)).get(action.key) : null,
        digets: (yield select(riskFactorsSelector)).has(action.key) ? (yield select(riskFactorsSelector)).get(action.key).digets : null,
        risks: yield select(risksSrcSelector)
      })
    } else {
      // Для сохранения дайджеста по юридическому лицу
      yield call(dowloadHtmlFile, {
        isFl: false,
        info: yield select(decodedCompanyName),
        mainKey: yield select(storeKey),
        headsFl: yield select(ebgHeads),
        mainDigets: (yield select(storeMainDigest)).digets,
        digets: yield select(storeRiskFactors),
        risks: yield select(storeRisksSrc),
        identify:  yield select(storeIdentifyInfoFl),
        croinform:  yield select(storeCroinformInfoFl),
        stopLists: yield select(storeStopLists),
        fsspInfo: yield select(storeFsspInfo),
        riskSource: yield select(decodedRiskSource)
      })
    }

    yield put({
      type: DOWNLOAD_REPORT_FILE + SUCCESS,
    })
  } catch (err){
    console.log('%cgetDocuments@Saga', cloCss.red, err)
    yield put({
      type: DOWNLOAD_REPORT_FILE + FAIL,
    })
  }
}

export const saga = function * () {
  yield takeEvery(LOAD_COMPANY_INFO, loadCompanyInfoSaga)
  yield takeEvery(LOAD_DIGEST_LIST, loadDigestListSaga)
  yield takeEvery(GET_RISK_FACTORS_FL_INFO, getRiskFactorsFlSaga)
  yield takeEvery(GET_DOCUMENT_ITEM, getDocumentItemSaga)
  yield takeEvery(UPDATE_SELECTED_USER_INFO, updateUserSelectedInfoSaga)
  yield takeEvery(ADD_RISK_FACTOR_IN_DIGEST_LIST, addRiskFactorSaga)
  yield takeEvery(EDIT_RISK_FACTOR_IN_DIGEST_LIST, editRiskFactorSaga)
  yield takeEvery(DELETE_RISK_FACTOR_IN_DIGEST_LIST, deleteRiskFactorSaga)
  yield takeEvery(ADD_RISK_FACTOR_FL_IN_DIGEST_LIST, addRiskFactorFlSaga)
  yield takeEvery(EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST, editRiskFactorFlSaga)
  yield takeEvery(DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST, deleteRiskFactorFlSaga)
  yield takeEvery(ADD_USER_TO_CHECK_LIST, getRiskFactorsNewUserSaga)
  yield takeEvery(GET_IDENTIFY_USER, identifyUserSaga)
  yield takeEvery(GET_CROINFORM_USER_INFO, getCroinformInfoSaga)
  yield takeEvery(DOWNLOAD_REPORT_FILE, downloadReportFileSaga)
}

export default openBillReducer