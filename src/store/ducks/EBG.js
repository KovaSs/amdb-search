import { createSelector } from 'reselect'
import { Record, Map, OrderedMap } from 'immutable'
import { all, put, call, fork, select, spawn, takeEvery, delay} from 'redux-saga/effects'
import { 
  trasform, 
  clearStopListsArr, 
  cloCss, 
  uuid,
  dowloadHtmlFile
} from "../../services/utils"
import { companyRes } from '../mock'
import { API } from '../../services/api'
import { jsonUl } from '../../services/fields'
import config from '../../config'

/** Constants */
export const moduleName = 'EBG'
export const prefix = `${config.appName}/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const LOAD_COMPANY_INFO_UL = `${prefix}/LOAD_COMPANY_INFO_UL`
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
export const LOAD_DIGEST_LIST_UL = `${prefix}/LOAD_DIGEST_LIST_UL`
export const ADD_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_IN_DIGEST_LIST`
export const ADD_RISK_FACTOR_UL_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_UL_IN_DIGEST_LIST`
export const EDIT_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/EDIT_RISK_FACTOR_IN_DIGEST_LIST`
export const EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST = `${prefix}/EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST`
export const ADD_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/ADD_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST = `${prefix}/DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST`
export const GET_FSSP_INFO = `${prefix}/GET_FSSP_INFO`
export const GET_STOP_LISTS_UL_INFO = `${prefix}/GET_STOP_LISTS_UL_INFO`
export const GET_RISK_FACTORS_FL_INFO = `${prefix}/GET_RISK_FACTORS_FL_INFO`
export const GET_DOCUMENTS = `${prefix}/GET_DOCUMENTS`
export const GET_DOCUMENT_ITEM = `${prefix}/GET_DOCUMENT_ITEM`
export const UPDATE_EBG_SYNC_DATA = `${prefix}/UPDATE_EBG_SYNC_DATA`
export const TAKE_EBG_ITEM = `${prefix}/TAKE_EBG_ITEM`
export const RETURN_EBG_ITEM = `${prefix}/RETURN_EBG_ITEM`
export const ACCEPT_EBG_ITEM = `${prefix}/ACCEPT_EBG_ITEM`
export const UPDATE_HEADS = `${prefix}/UPDATE_HEADS`
export const LOCATION_CHANGE = `@@router/LOCATION_CHANGE`

export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  mainObjectKey: null,
  isIp: false,
  reqnum: '',
  renderData: false,
  ebgData: null,
  risksSrc: [],
  croinformInfoFl: new Map({}),
  identifyInfoFl: new Map({}),
  selectedInfoFl: new Map({}),
  fsspInfo: new Map({}),
  stopLists: new Map({}),
  riskFactors: new Map({}),
  timeRequest: new Map({}),
  ebgMainResponse: null,
  companyResponse: OrderedMap({ ...companyRes, key: uuid()}),
  companyResponseUl: OrderedMap({}),
  requestLoading: new Map({
    acceptEbgItemRequest: false,
    returnEbgItemRequest: false,
    ebgMainDataRequest: false,
    ebgSyncTableData: false,
    companyMainInfo: false,
    getDocuments: false,
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    deleteRistFactorInDigestListUl: new Map({}),
    addRistFactorInDigestListFl: new Map({}),
    addRistFactorInDigestListUl: new Map({}),
    getStopListsUl: new Map({}),
    digestListUl: new Map({}),
    loadCompanyInfoUl: new Map({}),
    getDocumentItem: new Map({}),
    getRiskFactorsFl: new Map({}),
    stopLists: new Map({}),
    fsspInfo: new Map({}),
    getAffilatesUl: new Map({}),
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  }),
  errors: new Map({
    acceptEbgItemRequest: false,
    returnEbgItemRequest: false,
    ebgMainDataRequest: false,
    ebgSyncTableData: false,
    companyMainInfo: false, 
    getDocuments: false,
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestListFl:  new Map({}),
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    deleteRistFactorInDigestListUl: new Map({}),
    addRistFactorInDigestListUl: new Map({}),
    getStopListsUl: new Map({}),
    digestListUl: new Map({}),
    loadCompanyInfoUl: new Map({}),
    getDocumentItem: new Map({}),
    getRiskFactorsFl: new Map({}),
    stopLists: new Map({}),
    fsspInfo: new Map({}),
    getAffilatesUl: new Map({}),
    identifyUser: new Map({}),
    croinformRequest: new Map({})
  })
})

const EbgReducer = (state = new ReducerRecord(), action) => {
  const { type, payload, id } = action
  switch (type) {
    // Сохранение ИНН запроса
    case ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    // Обновление данных о руководителях и связанных лицах
    case UPDATE_HEADS:
      return state
        .set('selectedInfoFl', action.updatedStore.selected)
        .setIn(['companyResponse', 'heads'], action.updatedStore.heads)

    // Получение данных об выюранном объекте
    case TAKE_EBG_ITEM + START:
      return state
        .setIn(['requestLoading', 'ebgMainDataRequest'], true)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'ebgMainDataRequest'], false)
    case TAKE_EBG_ITEM + SUCCESS:
      return state
        .set('ebgMainResponse', payload.json)
        .setIn(['companyResponse', 'founders_ul'],  payload.foundersUl)
        .setIn(['errors', 'ebgMainDataRequest'], false)
    case TAKE_EBG_ITEM + FAIL:
      return state
        .setIn(['requestLoading', 'ebgMainDataRequest'], false)
        .setIn(['errors', 'ebgMainDataRequest'], true)

    // Получение данных об выюранном объекте
    case RETURN_EBG_ITEM + START:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], true) 
        .setIn(['errors', 'returnEbgItemRequest'], false)
    case RETURN_EBG_ITEM + SUCCESS:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], false)
        .setIn(['errors', 'returnEbgItemRequest'], false)
    case RETURN_EBG_ITEM + FAIL:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], false)
        .setIn(['errors', 'returnEbgItemRequest'], true)

    // Звершение Ebg проверки по выбранному объекту
    case ACCEPT_EBG_ITEM + START:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], true) 
        .setIn(['errors', 'acceptEbgItemRequest'], false)
    case ACCEPT_EBG_ITEM + SUCCESS:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], false)
        .setIn(['errors', 'acceptEbgItemRequest'], false)
    case ACCEPT_EBG_ITEM + FAIL:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], false)
        .setIn(['errors', 'acceptEbgItemRequest'], true)

    // Обновление основных данных по кампании
    case LOAD_COMPANY_INFO + UPDATE + START:
      return state
        .set('reqnum', id)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'companyMainInfoUpdate'], false)      
    case LOAD_COMPANY_INFO + UPDATE + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .set('mainObjectKey', action.key)
        .setIn(['companyResponseUl', action.key], payload.updatedData)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['requestLoading', 'ebgMainDataRequest'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], false) 
        .set('renderData', true)
        .set('reqnum', id)
        .set('isIp', action.isIp)
    case LOAD_COMPANY_INFO + UPDATE + FAIL:
      return state
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], { status: action.error.status, message: action.error.message, time: action.error.time })
        .set('renderData', false)

    // Обновление основных данных по связанным UL кампаниям
    case LOAD_COMPANY_INFO_UL + UPDATE + START:
      return state
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], true)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], false)     
    case LOAD_COMPANY_INFO_UL + UPDATE + SUCCESS:
      return state
        .setIn(['companyResponseUl', action.id], payload.updatedData)
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], false)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], false) 
    case LOAD_COMPANY_INFO_UL + UPDATE + FAIL:
      return state
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], false)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Сохранение данных об аффилированных лица
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
        .setIn(['companyResponse', 'heads'], payload.updatedData)
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
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['errors', 'updateSelectedUserInfo'], false) 
    case UPDATE_SELECTED_USER_INFO + FAIL:
      return state
        .setIn(['errors', 'updateSelectedUserInfo'], action.error.status)

    case GET_CROINFORM_USER_INFO + START:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
    case GET_CROINFORM_USER_INFO + SUCCESS:
      return state
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['croinformInfoFl', action.loading], action.croinform)
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
        .setIn(['fsspInfo', action.loading], action.fsspInfo)
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], false) 
    case GET_FSSP_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], true)

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

    // Загрузка данных по риск факторам ЮЛ
    case LOAD_DIGEST_LIST_UL + START:
      return state
        .setIn(['requestLoading', 'digestListUl', action.id], true)
        .setIn(['errors', 'digestListUl', action.id], false)
    case LOAD_DIGEST_LIST_UL + SUCCESS:
      return state
        .set('risksSrc', action.risksSrc)
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'digestListUl', action.id], false)
        .setIn(['errors', 'digestListUl', action.id], false) 
    case LOAD_DIGEST_LIST_UL + FAIL:
      return state
        .setIn(['requestLoading', 'digestListUl', action.id], false)
        .setIn(['errors', 'digestListUl', action.id], true)

        // Добавление риск фактора в дайджест лист UL
    case ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Редактирование риск фактора в дайджест лист UL
    case EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление риск фактора в дайджест лист UL
    case DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Редактирование риск-фактора из дайджест листа
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], true)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], false)
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], false)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], false) 
    case ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], false)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], true)

    // Редактирование риск-фактора из дайджест листа
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    case GET_STOP_LISTS_UL_INFO + START:
      return state
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], true)
        .setIn(['errors', 'getStopListsUl', action.keyId], false)
    case GET_STOP_LISTS_UL_INFO + SUCCESS:
      return state
        .setIn(['stopLists', action.keyId], payload)
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], false)
        .setIn(['errors', 'getStopListsUl', action.keyId], false) 
    case GET_STOP_LISTS_UL_INFO + FAIL:
      return state
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], false)
        .setIn(['errors', 'getStopListsUl', action.keyId], true)

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

    // Синхранизация данных по ЭБГ
    case UPDATE_EBG_SYNC_DATA + START:
      return state
        .setIn(['requestLoading', 'ebgSyncTableData'], true)
        .setIn(['errors', 'ebgSyncTableData'], false)
    case UPDATE_EBG_SYNC_DATA + SUCCESS:
      return state
        .set('ebgData', payload)
        .setIn(['requestLoading', 'ebgSyncTableData'], false)
        .setIn(['errors', 'ebgSyncTableData'], false) 
    case UPDATE_EBG_SYNC_DATA + FAIL:
      return state
        .setIn(['requestLoading', 'ebgSyncTableData'], false)
        .setIn(['errors', 'ebgSyncTableData'], true)

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
  return {
    type: ADD_USER_TO_CHECK_LIST,
    payload: {newUser},
  }
}
// Добавление нового риск-фактора
export const addRiskFactorFl = (factor, id) => {
  return {
    type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора
export const editRiskFactorFl = (factor, id) => {
  return {
    type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора
export const deleteRiskFactorFl = (factor, id) => {
  return {
    type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора UL
export const addRiskFactorUl = (factor, info) => {
  return {
    type: ADD_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
  }
}
// Редактирование риск-фактора UL
export const editRiskFactorUl = (factor, info) => {
  return {
    type: EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
  }
}
// Добавление нового риск-фактора
export const deleteRiskUlFactor = (factor, info) => {
  return {
    type: DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
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
    payload: user,
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
export const takeEbgItem = data => {
  return {
    type: TAKE_EBG_ITEM,
    payload: data
  }
}
// Проверка юзера через Croinform
export const returnEbgItem = data => {
  return {
    type: RETURN_EBG_ITEM,
    payload: data
  }
}
// Проверка юзера через Croinform
export const acceptEbgItem = data => {
  return {
    type: ACCEPT_EBG_ITEM,
    payload: data
  }
}
// Ручное обновление списка риск-факторов
export const updateDigets = () => {
  return {
    type: LOAD_DIGEST_LIST
  }
}
// Ручное обновление списка риск-факторов foundersUl
export const updateDigetsUl = ({ inn,  id, storeCompName, reqnum }) => {
  return {
    type: LOAD_DIGEST_LIST_UL,
    inn, 
    id,
    storeCompName,
    reqnum
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
const storeRouter = state => state.router
const storeRouterLocation = state => state.router.location.pathname
const storeLoading = state => state[moduleName].get("requestLoading")

export const companyResSelector = state => state[moduleName].get('companyResponse').toJS()
export const mainObjectKeySelector = state => state[moduleName].get('mainObjectKey')
export const companyUlResSelector = state => state[moduleName].get('companyResponseUl')
export const companyImmutableResSelector = state => state[moduleName].get('companyResponse')
export const ebgMainResponseSelector = state => state[moduleName].get('ebgMainResponse')
export const ebgDataSelector = state => state[moduleName].get('ebgData')
export const documentsSelector = state => state[moduleName].getIn(['companyResponse', 'documents'])
export const headsSelector = state => state[moduleName].getIn(['companyResponse', 'heads'])
export const foundersUlSelector = state => state[moduleName].getIn(['companyResponse', 'founders_ul'])
export const digetsListSelector = state => state[moduleName].get('digestList')
export const renderDataSelector = state => state[moduleName].get('renderData')
export const fsspSelector = state => state[moduleName].get('fsspInfo')
export const isIpSelector = state => state[moduleName].get('isIp')
export const reqnumSelector = state => state[moduleName].get('reqnum')
export const innSelector = state => state[moduleName].get('inn')
export const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
export const сroinformResSelector = state => state[moduleName].get('croinformResponse')
export const errorsSelector = state => state[moduleName].get('errors')
export const companySrcSelector = state => state[moduleName].get('companyResponse')
export const risksListSelector = state => state[moduleName].get('risksList')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading')
export const risksSrcSelector = state => state[moduleName].get('risksSrc')
export const mainDigetsSelector = state => state[moduleName].get('riskFactors')
export const identifyInfoFlSelector = state => state[moduleName].get('identifyInfoFl')
export const selectedInfoFlSelector = state => state[moduleName].get('selectedInfoFl')
export const croinformInfoFlSelector = state => state[moduleName].get('croinformInfoFl')
export const fsspInfoSelector = state => state[moduleName].get('fsspInfo')
export const stopListsSelector = state => state[moduleName].get('stopLists')
export const timeRequestSelector = state => state[moduleName].get('timeRequest')
export const riskFactorsSelector = state => state[moduleName].get('riskFactors')
export const companyUlSrcSelector = state => state[moduleName].get('companyResponseUl')
// With key props
export const companyUlImmutableResSelector = (state, key) => state[moduleName].getIn(['companyResponseUl', key])
export const nameUlSelector = (state, key) => state[moduleName].getIn(['companyResponseUl', key, 'name'], null)
export const loadingFoundersUlSelector = (state, key) => state[moduleName].getIn(['requestLoading',"loadCompanyInfoUl", key], true)
export const digetsListUlSelector = (state, key) => state[moduleName].getIn(['digestListUl', key], [])
export const stopListSelector = (state, key) => state[moduleName].getIn(['stopLists', key], [])
export const riskFactorsItemSelector = (state, keyId) => state[moduleName].getIn(['riskFactors', keyId], {digets: [], history: []})
export const headItemKeySelector = (state, key) => key


export const storeTimeRequest = createSelector( timeRequestSelector, timeRequest =>  timeRequest )
export const storeIdentifyInfoFl = createSelector( identifyInfoFlSelector, identifyInfo =>  identifyInfo )
export const storeFsspInfo = createSelector( fsspInfoSelector, fsspInfo =>  fsspInfo )
export const storeStopLists = createSelector( stopListsSelector, stopLists =>  stopLists )
export const storeSelectedInfoFl = createSelector( selectedInfoFlSelector, selectedInfo =>  selectedInfo )
export const storeCroinformInfoFl = createSelector( croinformInfoFlSelector, croinformInfo =>  croinformInfo )
export const storeRiskFactors = createSelector( riskFactorsSelector, risks =>  risks )

export const decodedCompanyResponse = createSelector( companyResSelector, companyResponse =>  companyResponse )
export const ebgHeads = createSelector( headsSelector, heads =>  heads )
export const ebgFoundersUl = createSelector( foundersUlSelector, foundersUl =>  foundersUl )
export const decodedRisksList = createSelector( risksListSelector, risksList =>  risksList )
export const decodedEbgMainResponse = createSelector( ebgMainResponseSelector, ebgMainResponse =>  ebgMainResponse )
export const decodedEbgData = createSelector( ebgDataSelector, ebgData =>  ebgData )
export const decodedDocuments = createSelector( documentsSelector, documents =>  documents )
export const decodedFsspInfo = createSelector( fsspSelector, fssp =>  fssp )
export const decodedDigetsList = createSelector( digetsListSelector, digets =>  digets )
export const decodedisIp = createSelector( isIpSelector, isIp =>  isIp )
export const decodedСroinformResponse = createSelector( сroinformResSelector, сroinformRes =>  сroinformRes )
export const decodedCompanyName = createSelector( nameCompanySelector, companyName =>  companyName )
export const decodedReqnum = createSelector( reqnumSelector, reqnum => reqnum )
export const decodedInn = createSelector( innSelector, inn => inn )
export const decodedRenderData = createSelector( renderDataSelector, renderData => renderData )
export const decodedRequestLoading = createSelector( requestLoadingSelector, requestLoading => requestLoading )
export const decodedErrors = createSelector( errorsSelector, errors => errors )
export const storeRisksSrc = createSelector( risksSrcSelector, (risksSrc) =>  risksSrc )

// With key props
export const storeRiskFactorsItem = createSelector( riskFactorsItemSelector, riskItem =>  riskItem )
export const storeMainDigest = createSelector( mainDigetsSelector, riskFactors =>  trasform.getMainDigest(riskFactors) )
export const loadingFoundersUl = createSelector( loadingFoundersUlSelector, requestLoading => requestLoading !== undefined ? requestLoading : true )
export const nameFoundersUl = createSelector( nameUlSelector, name => name !== undefined ? name : null )
export const ebgCompanyResponseUl = createSelector( companyUlImmutableResSelector, companyResponse =>  companyResponse !== undefined ? companyResponse.toJS() : {} )
export const ebgDigetsListUl = createSelector( digetsListUlSelector, digets =>  digets !== undefined ? digets : [] )
export const ebgHeadItem = createSelector( headsSelector, headItemKeySelector, (heads, keyId) => heads.find(item => item.id === keyId) )
export const ebgCheckingItem = createSelector( ebgDataSelector, innSelector, (ebgData, inn) => ebgData.find(item => item.info.inn === inn) )

export const ebgHeadItemRiskFactors = createSelector( headsSelector, headItemKeySelector, (heads, keyId) => {
  const headItem = heads.find(item => item.id === keyId)
  if(headItem && headItem.risk_factors && headItem.risk_factors.history.length) {
    return headItem.risk_factors.history.length
  } else return 0
})

export const ebgMainCompanyRes = createSelector( companyUlResSelector, mainObjectKeySelector,
  (companyResponseUl, mainObjectKey) =>  mainObjectKey && companyResponseUl.filter((item, index) => index === mainObjectKey).get(mainObjectKey).toJS() )

export const ebgCompanyRes = createSelector( companyUlResSelector, headItemKeySelector,
  (companyResponseUl, objectKey) =>  companyResponseUl.has(objectKey) && companyResponseUl.get(objectKey).toJS() )

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

export const ebgMainSourceUl = createSelector(
  companyUlImmutableResSelector, companyResponse => {
    const  companySource = companyResponse !== undefined ? companyResponse.filterNot((value, key) => 
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
    ).toJS() : {}
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
  companyImmutableResSelector, stopListSelector, (companyResponse, stopLists) => {
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
    return trasform.riskSource({...riskSource, stop_list: stopLists})
  }
)

export const mainRiskSource = createSelector(
  companyImmutableResSelector, stopListsSelector, mainObjectKeySelector, (companyResponse, stopLists, mainKey) => {
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
    const mainSL = stopLists.get(mainKey)
    return trasform.riskSource({...riskSource, stop_list: mainSL})
  }
)

export const ebgRiskSource = createSelector(
  companyUlImmutableResSelector, stopListSelector, (companyResponse, stopLists) => {
    if(!companyResponse) return []
    const riskSource = companyResponse.filter((value, key) => 
      key === "arbiter" ||
      key === "fns" ||
      key === "sanctions" ||
      key === "isponlit_proizvodstva" ||
      key === "spiski" ||
      key === "spark_spiski" ||
      key === "arbiter_other"
    ).toJS()
    return trasform.riskSource({...riskSource, stop_list: stopLists})
  }
)

export const decodedManagementSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const managementSource = companyResponse.filter((value, key) => key === "heads").toJS()
    return trasform.getHeadsSrc(managementSource)
  }
)

export const storeUlSource = createSelector( companyUlSrcSelector, ulSrc => ulSrc)

export const storeEbgJsonInfo = createSelector( ebgMainResponseSelector, ebgSrc =>  {
  if(ebgSrc && ebgSrc.client.clientType === "COMPANY") {
    let JsonSrc = new Map({...jsonUl})
    const blank = ebgSrc.client.blank
    for (const key in blank) {
      JsonSrc = JsonSrc.setIn(["blank", key, "data"], blank[key])
    }
    // const bankRequisites = ebgSrc.client.bankRequisites
    console.log('%cJsonSrc', cloCss.red, JsonSrc.toJS())
    console.log('%cEbgRes', cloCss.red, ebgSrc)
    return ebgSrc
  } else return ebgSrc
})

/** Sagas */

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * (action) {
  try {
    yield put({
      type: LOAD_COMPANY_INFO + UPDATE + START
    })
    // Запрос на получение основных данных о кампании
    const res = yield call(API.getLoadCompanyInfo, action.inn, 4)

    const data = res.data.company_info
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)

    // Проверка является ли проверяемый объект ИП
    if(res.data.ip && res.status.success) {
      const updatedData = yield call(trasform.updateIPComSrc, yield select(companyImmutableResSelector), data, res.reqnum)
      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum,
        isIp: true,
        payload: {updatedData},
        key: yield updatedData.get('key')
      })

      yield call(updateEbgJsonInfoSaga)
      yield call(loadDigestListUlSaga, {
        inn: yield updatedData.get('inn'), 
        id: yield updatedData.get('key'),
        storeCompName: yield updatedData.get('name'),
        reqnum: yield updatedData.get('reqnum')
      })

    } else if (!res.data.ip && res.status.success) {
      const updatedData = yield call(trasform.updateComSrc, yield select(companyImmutableResSelector), data, res.reqnum)

      yield spawn(getStopListsUlSaga, yield updatedData.get("inn"), res.reqnum, yield updatedData.get("key") )

      yield put({
        type: LOAD_COMPANY_INFO + UPDATE + SUCCESS,
        id: res.reqnum,
        isIp: false,
        payload: {updatedData},
        key: yield updatedData.get('key')
      })

      yield call(updateEbgJsonInfoSaga)
      yield call(loadDigestListUlSaga, {
        inn: yield updatedData.get('inn'), 
        id: yield updatedData.get('key'),
        storeCompName: yield updatedData.get('name'),
        reqnum: yield updatedData.get('reqnum')
      })

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
    console.log('%cloadCompanyInfoSagaErr', cloCss.red, err)
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

const loadCompanyInfoUlSaga = function * (action) {
  try {
    yield put({
      type: LOAD_COMPANY_INFO_UL + UPDATE + START,
      id: action.id
    })
    // Запрос на получение основных данных о кампании
    const res = yield call(API.getLoadCompanyInfo, action.inn, 4)
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)
    const data = res.data.company_info

    if (!res.data.ip && res.status.success) {
      const updatedData = yield call(trasform.updateComSrc, OrderedMap({ ...companyRes, key: action.id }), data, res.reqnum)

      yield spawn(getStopListsUlSaga, yield updatedData.get("inn"), res.reqnum, yield updatedData.get("key") )

      yield put({
        type: LOAD_COMPANY_INFO_UL + UPDATE + SUCCESS,
        id: action.id,
        payload: {updatedData},
      })

      yield call(loadDigestListUlSaga, {
        inn: yield updatedData.get('inn'), 
        id: action.id,
        storeCompName: yield updatedData.get('name'),
        reqnum: yield updatedData.get('reqnum')
      })

    } else if (!res.status.success) {
      yield put({
        type: LOAD_COMPANY_INFO_UL + UPDATE + FAIL,
        id: action.id,
        error: {
          status: true,
          time: Date.now(),
          message: "Данные о кампании не получены, пожалуйста повторите запрос" 
        }
      })
    }

  } catch (err){
    console.log('%cloadCompanyInfoUlSaga@Err', cloCss.red, err)
    yield put({
      type: LOAD_COMPANY_INFO_UL + UPDATE + FAIL,
      id: action.id,
      error: {
        status: true,
        time: Date.now(),
        message: "Данные о кампании не получены, пожалуйста повторите запрос" 
      }
    })
  }
}

/* Обогащение полученной информации данными из JSON */
const updateEbgJsonInfoSaga = function * () {
  try {
    const ebgStore = yield select(decodedEbgMainResponse)
    const param = ebgStore.client.clientType === "COMPANY" ?
      ebgStore.client.management.companyPersons : [ebgStore.client.selfEmployed]
    // Обогащение найденных руководителей информацией полученной из Ebg
    const updatedStore = yield call(trasform.updateEbgHeads, {
      prevStore: yield select(),
      prevSelected: new Map({}),
      managment: param
    })
    console.log('%cSTORE', cloCss.info, updatedStore)

    yield put({
      type: UPDATE_HEADS,
      updatedStore
    })

    // Автоматический запрос данных в croinform при условии, что имеются все данные для запроса в JSON'e Ebg
    yield all(updatedStore.heads.map(item => {
      const {
        CityExp,
        DateOfBirth,
        FirstName,
        HouseExp,
        MiddleName,
        Number: selNumber,
        RegionExp,
        Seria,
        StreetExp,
        SurName
      } = updatedStore.selected.get(item.id)

      if(
        FirstName && 
        SurName && 
        MiddleName && 
        selNumber && 
        Seria && 
        RegionExp && 
        CityExp && 
        StreetExp && 
        HouseExp &&
        DateOfBirth
      ) {
        return fork(getCroinformInfoSaga, {
          loading: item.id,
          payload: {
            ...updatedStore.selected.get(item.id)
          }
        })
      } else return item
    }))

    if(updatedStore.heads.length) {
      const reqnum = yield select(decodedReqnum)
      yield all(updatedStore.heads.map(item =>  fork(getRiskFactorsFlSaga, {
        user: item, 
        reqnum
      })))
    }
  } catch (err) {
    console.log('%cupdateEbgJsonInfoSaga@Err', cloCss.red, err)
  }
  
}

/* Поиск данных стоп-листов о ЮЛ */
const getStopListsUlSaga = function * (ulinn, reqnum, key) {
  try {
    yield put({
      type: GET_STOP_LISTS_UL_INFO + START,
      keyId: key
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getStopLists, { ulinn, type: 'ul', method: 'bases' }, reqnum, 4)
    console.log("%cRES | GET STOP LIST UL",  cloCss.green, res)
    const clearedData = res.data && res.data.length ? clearStopListsArr(res.data) : []

    yield put({
      type: GET_STOP_LISTS_UL_INFO + SUCCESS,
      payload: clearedData,
      keyId: key
    })
  } catch (err){
    console.log('%cgetStopListsUlSagaErr', cloCss.red, err)
    yield put({
      type: GET_STOP_LISTS_UL_INFO + FAIL,
      keyId: key
    })
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
    const res = yield call(API.getStopListFl, action, yield select(decodedReqnum), 4)
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
const loadDigestListUlSaga = function * (action) {
  try {
    yield put({
      type: LOAD_DIGEST_LIST_UL + START,
      id: action.id
    })

    /* Запрос данных для DigetsList */
    const res = yield call(API.getDigestList, action.reqnum)
    console.log("%cRES | LOAD DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: action.inn,
        name: action.storeCompName,
        id: action.id
      }
    })

    yield put({
      type: LOAD_DIGEST_LIST_UL + SUCCESS,
      risksSrc: res.data.risks,
      riskFactors: riskFactors,
      id: action.id
    })
  } catch (err){
    console.log('%loadDigestListUlSaga@Err', cloCss.red, err)
    yield put({
      type: LOAD_DIGEST_LIST_UL + FAIL,
      id: action.id
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorUlSaga = function * (action) {
  try {
    yield put({
      type: ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + START,
      id: action.info.id
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactor, action.info.reqnum, action.payload, 4)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: action.info.inn,
        name: action.info.storeCompName,
        id: action.info.id
      }
    })

    yield put({
      type: ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      id: action.info.id
    })
  } catch (err){
    console.log('%caddRiskFactorUlSaga@Err', cloCss.red, err)
    yield put({
      type: ADD_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL,
      id: action.info.id
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorUlSaga = function * (action) {
  try {
    yield put({
      type: EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + START,
      id: action.info.id
    })

    /* Запрос на редактирование UL риск-фактора  */
    const res = yield call(API.editRiskFactorRequest, action.info.reqnum, action.payload)
    console.log("%cRES | EDIT RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: action.info.inn,
        name: action.info.storeCompName,
        id: action.info.id
      }
    })

    yield put({
      type: EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      id: action.info.id
    })
  } catch (err){
    console.log('%editRiskFactorUlSaga@Err', cloCss.red, err)
    yield put({
      type: EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL,
      id: action.info.id
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorUlSaga = function * (action) {
  try {
    yield put({
      type: DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + START,
      id: action.info.id
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactor, action.info.reqnum, action.payload, 4)
    console.log("%cRES | DELETE RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: action.info.inn,
        name: action.info.storeCompName,
        id: action.info.id
      }
    })

    yield put({
      type: DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + SUCCESS,
      riskFactors: riskFactors,
      id: action.info.id
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSagaErr', cloCss.red, err)
    yield put({
      type: DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST + FAIL,
      id: action.info.id
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
    const res = yield call(API.getRiskFactorsFl, reqnum, user, 4)
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
    // yield call(loadDigestListSaga)
  } catch (err){
    console.log('%cgetRiskFactorsFlSagaErr', cloCss.red, err)
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + FAIL,
      loading: user.id
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
    const res = yield call(API.getRiskFactorsFl, yield select(decodedReqnum), user, 4)
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
    console.log('%cgetRiskFactorsFlSagaErr', cloCss.red, err)
    yield put({
      type: GET_RISK_FACTORS_FL_INFO + FAIL,
      loading: user.id
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + START,
      loading: action.loading
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactorFl, yield select(decodedReqnum), action.payload, 4)
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
    console.log('%caddRiskFactorSagaErr', cloCss.red, err)
    yield put({
      type: ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL,
      loading: action.loading
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + START,
      loading: action.loading
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.editRiskFactorFlRequest, yield select(decodedReqnum), action.payload, 4)
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
      loading: action.loading
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + START,
      loading: action.loading
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactorFl, yield select(decodedReqnum), action.payload, 4)
    console.log("%cRES | DELETE RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

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
    console.log('%cdeleteRiskFactorSagaErr', cloCss.red, err)
    yield put({
      type: DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + FAIL,
      loading: action.loading
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
    const res = yield call(API.getIdentifyUser, 
      yield select(decodedisIp),
      yield select(decodedReqnum),
      action.payload.user
    )
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

/* Получение полной информации из источников об проверяемом пользователе */
const getCroinformInfoSaga = function * (action) {
  try {
    yield put({
      type: GET_CROINFORM_USER_INFO + START,
      selected: action.payload,
      loading: action.loading,
    })

    yield call(loadStopListDataSaga, action)

    /* Переключение на mock данные */
    const res = yield call(API.getIdentifyUserInfo, yield select(decodedReqnum), action.payload, 4)
    console.log("%cRES | GET CROINFORM USER INFO", cloCss.green, res)

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
    yield call(getRiskFactorsFlSaga, {
      user: heads.find(item => item.id === action.loading),
      reqnum: res.reqnum
    })

  } catch (err){
    console.log('%cidentifyUserInfoSaga@Err', cloCss.red, err)
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
const getFsspInfoSaga = function * (reqnum, action) {
  try {
    yield put({
      type: GET_FSSP_INFO + START,
      loading: action.loading
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getFsspInfo, reqnum, action.payload, 4)
    console.log("%cRES | GET FSSP INFO",  cloCss.green, res)

    const fsspInfo = yield call(trasform.clearedFsspInfo, res.data.html)

    yield put({
      type: GET_FSSP_INFO + SUCCESS,
      fsspInfo,
      loading: action.loading
    })
  } catch (err){
    console.log('%cgetFsspInfoSagaErr', cloCss.red, err)
    yield put({
      type: GET_FSSP_INFO + FAIL,
      loading: action.loading
    })
  }
}

/* Синхронизация данных для таблицы ЕБГ*/
const backgroundSyncSaga = function * () {
  while(true) {
    const pathname = yield select(storeRouterLocation)
    if(pathname === "/electronic-bank-garantees" || pathname === "/electronic-bank-garantees/") {
      try {
        yield put({
          type: UPDATE_EBG_SYNC_DATA + START
        })

        const res = yield call(API.getEbgSyncData)
        const ebgData = yield call(trasform.updateEbgTable, res.data)

        yield put({
          type: UPDATE_EBG_SYNC_DATA + SUCCESS,
          payload: ebgData
        })
    
      } catch (err) {
        console.log('%cbackgroundSyncSaga@Err', cloCss.red, err)
        yield put({
          type: UPDATE_EBG_SYNC_DATA + FAIL
        })
      }
    }
    yield delay(10000)
  }
}

/* Взять на проверку элемент из ЕБГ таблицы */
const takeEbgItemSaga = function * (action) {
  try {
    yield put({
      type: TAKE_EBG_ITEM + START
    })

    const router = yield select(storeRouter)
    const pathName = `/electronic-bank-garantees/${action.payload.inn}`

    // Проверка находимся мы в очереди или уже непосредственнов в компоненте отображения
    if(router.location.pathname !== pathName) {
      const takeRes = yield call(API.takeEbgItemToWork, action.payload.inn)
      // Проверка взят ли уже объект другим пользователем
      if(!takeRes.status.success) {
        console.log('%ctakeEbgItemSagaErr', cloCss.red, takeRes.status)
        yield put({
          type: TAKE_EBG_ITEM + FAIL
        })
      } else {
        // Если не взят, тогда уже запускаем процесс запроса и отображения данных
        const res = yield call(API.getEbgDataItemInfo, action.payload)
        console.log("%cRES | GET EBG ITEM INFO",  cloCss.green, res)

        const param = res.data.client.clientType === "COMPANY" ? 
          res.data.client.management.legalFounders : res.data.client.selfEmployed

        const foundersUl = yield call(trasform.getEbgFoundersUlKey, param)

        yield put({
          type: TAKE_EBG_ITEM + SUCCESS,
          payload: {
            json: res.data,
            foundersUl
          }
        })

        if(router.location.pathname !== pathName)  yield put({
          type: LOCATION_CHANGE,
          payload: {
            ...router,
            location: {
              ...router.location,
              pathname: pathName
            }
          }
        })
      }
    } else {
      // Условие того что мы находимся в компоненте отображения
      const res = yield call(API.getEbgDataItemInfo, action.payload)
      console.log("%cRES | GET EBG ITEM INFO",  cloCss.green, res)

      const param = res.data.client.clientType === "COMPANY" ? 
        res.data.client.management.legalFounders : []

      const foundersUl = yield call(trasform.getEbgFoundersUlKey, param)

      yield put({
        type: TAKE_EBG_ITEM + SUCCESS,
        payload: {
          json: res.data,
          foundersUl
        }
      })

      const resEbgItem = yield call(API.getEbgSyncData)
      const ebgData = yield call(trasform.updateEbgTable, resEbgItem.data)

      yield put({
        type: UPDATE_EBG_SYNC_DATA + SUCCESS,
        payload: ebgData
      })

      yield call(loadCompanyInfoSaga, action.payload)
      yield all(foundersUl.map(item => call(loadCompanyInfoUlSaga, {inn: item.inn, id: item.key})))
    }

  } catch (err){
    console.log('%ctakeEbgItemSaga@Err', cloCss.red, err)
    yield put({
      type: TAKE_EBG_ITEM + FAIL
    })
  }
}

/* Возврат на проверку элемента из ЕБГ таблицы */
const returnEbgItemSaga = function * (action) {
  try {
    yield put({
      type: RETURN_EBG_ITEM + START
    })

    const router = yield select(storeRouter)
    const pathName = `/electronic-bank-garantees`

    /* Запрос на возврат в очередь */
    const res = yield call(API.returnEbgItemToQueue, action.payload.inn)
    console.log("%cRES | RETURN EBG ITEM",  cloCss.green, res)

    if(res.status.success) {
      yield put({
        type: CLEAR_COMPANY_INFO
      })
  
      yield put({
        type: LOCATION_CHANGE,
        payload: {
          ...router,
          location: {
            ...router.location,
            pathname: pathName
          }
        }
      })
    }

  } catch (err){
    console.log('%creturnEbgItemSagaErr', cloCss.red, err)
    yield put({
      type: RETURN_EBG_ITEM + FAIL
    })
  }
}

/* Завершение проверки объекта и возвращение в ЕБГ таблицу */
const acceptEbgItemSaga = function * (action) {
  try {
    yield put({
      type: ACCEPT_EBG_ITEM + START
    })

    const router = yield select(storeRouter)
    const pathName = `/electronic-bank-garantees`

    /* Зпрос - закончить проверку */
    const res = yield call(API.acceptEbgItem, action.payload.inn)
    console.log("%cRES | ACCEPT EBG ITEM",  cloCss.green, res)

    if(res.status.success) {
      yield put({
        type: CLEAR_COMPANY_INFO
      })
  
      yield put({
        type: LOCATION_CHANGE,
        payload: {
          ...router,
          location: {
            ...router.location,
            pathname: pathName
          }
        }
      })
    }

  } catch (err){
    console.log('%cacceptEbgItemSagaErr', cloCss.red, err)
    yield put({
      type: ACCEPT_EBG_ITEM + FAIL
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
        mainKey: yield select(mainObjectKeySelector),
        info: yield select(decodedCompanyName),
        headsFl: yield select(ebgHeads),
        mainDigets: (yield select(storeMainDigest)).digets,
        digets: yield select(storeRiskFactors),
        risks: yield select(storeRisksSrc),
        identify:  yield select(storeIdentifyInfoFl),
        croinform:  yield select(storeCroinformInfoFl),
        stopLists: yield select(storeStopLists),
        fsspInfo: yield select(storeFsspInfo),
        riskSource: yield select(mainRiskSource),
        foundersUl: yield select(ebgFoundersUl),
        companyUlRes: yield select(storeUlSource)
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
  yield takeEvery(ADD_RISK_FACTOR_UL_IN_DIGEST_LIST, addRiskFactorUlSaga)
  yield takeEvery(EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST, editRiskFactorUlSaga)
  yield takeEvery(DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST, deleteRiskFactorUlSaga)
  yield takeEvery(ADD_RISK_FACTOR_FL_IN_DIGEST_LIST, addRiskFactorFlSaga)
  yield takeEvery(EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST, editRiskFactorFlSaga)
  yield takeEvery(UPDATE_SELECTED_USER_INFO, updateUserSelectedInfoSaga)
  yield takeEvery(DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST, deleteRiskFactorFlSaga)
  yield takeEvery(ADD_USER_TO_CHECK_LIST, getRiskFactorsNewUserSaga)
  yield takeEvery(LOAD_DIGEST_LIST_UL, loadDigestListUlSaga)
  yield takeEvery(GET_RISK_FACTORS_FL_INFO, getRiskFactorsFlSaga)
  yield takeEvery(GET_IDENTIFY_USER, identifyUserSaga)
  yield takeEvery(GET_CROINFORM_USER_INFO, getCroinformInfoSaga)
  yield takeEvery(TAKE_EBG_ITEM, takeEbgItemSaga)
  yield takeEvery(RETURN_EBG_ITEM, returnEbgItemSaga)
  yield takeEvery(ACCEPT_EBG_ITEM, acceptEbgItemSaga)
  yield takeEvery(DOWNLOAD_REPORT_FILE, downloadReportFileSaga)
  yield call(backgroundSyncSaga)
}

export default EbgReducer
