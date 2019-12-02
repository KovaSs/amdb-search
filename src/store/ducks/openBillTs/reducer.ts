import { Record, Map, OrderedMap } from 'immutable'
import { uuid } from "../../../services/utils"
import { companyRes } from '../../mock'
import constants from './constants'

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
  croinformInfoFl: Map({}),
  identifyInfoFl: Map({}),
  selectedInfoFl: Map({}),
  fsspInfo: Map({}),
  stopLists: Map({}),
  riskFactors: Map({}),
  timeRequest: Map({}),
  requestLoading: Map({
    companyMainInfo: false,
    getDocuments: false,
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    getDocumentItem: Map({}),
    getRiskFactorsFl: Map({}),
    stopLists: Map({}),
    fsspInfo: Map({}),
    getAffilatesUl: Map({}),
    identifyUser: Map({}),
    croinformRequest: Map({})
  }),
  errors: Map({
    companyMainInfo: false, 
    getDocuments: false,
    getStopListsUl: false, 
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestList: false,
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    getDocumentItem: Map({}),
    getRiskFactorsFl: Map({}),
    stopLists: Map({}),
    fsspInfo: Map({}),
    getAffilatesUl: Map({}),
    identifyUser: Map({}),
    croinformRequest: Map({})
  })
})

const openBillReducer = (state = new ReducerRecord(), action) => {
  const { type, payload, id } = action
  switch (type) {
    // Сохранение ИНН запроса
    case constants.ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    // Обновление основных данных по кампании
    case constants.LOAD_COMPANY_INFO + constants.UPDATE + constants.START:
      return state
        .set('reqnum', id)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'companyMainInfoUpdate'], false)      
    case constants.LOAD_COMPANY_INFO + constants.UPDATE + constants.SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], false) 
        .set('renderData', true)
        .set('reqnum', id)
        .set('isIp', action.isIp)
    case constants.LOAD_COMPANY_INFO + constants.UPDATE + constants.FAIL:
      return state
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], { status: action.error.status, message: action.error.message, time: action.error.time })
        .set('renderData', false)

    // Сохранение данных об аффилированных лица
    case constants.GET_AFFILATES_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], true)
        .setIn(['errors', 'getAffilatesList'], false)      
    case constants.GET_AFFILATES_LIST + constants.SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .set('selectedInfoFl', payload.selectedInfo)
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], false) 
    case constants.GET_AFFILATES_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], true)

    case constants.GET_AFFILATES_UL + constants.START:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: true, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name})      
    case constants.GET_AFFILATES_UL + constants.SUCCESS:
      return state
        .setIn(['companyResponse', 'heads'], payload.updatedData)
        .set('selectedInfoFl', payload.selectedInfo)
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name}) 
    case constants.GET_AFFILATES_UL + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: true, name: action.loading.name})

    case constants.GET_IDENTIFY_USER + constants.START:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'identifyUser', action.loading], true)
        .setIn(['errors', 'identifyUser', action.loading], false)
    case constants.GET_IDENTIFY_USER + constants.SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload.updatedUserInfo)
        .setIn(['identifyInfoFl', action.loading], action.info)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'identifyUser', action.loading], false)
        .setIn(['errors', 'identifyUser', action.loading], false) 
    case constants.GET_IDENTIFY_USER + constants.FAIL:
      return state
        .setIn(['requestLoading', 'identifyUser', action.error.id], false)
        .setIn(['errors', 'identifyUser', action.error.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Сохранение данных введеных пользователем
    case constants.UPDATE_SELECTED_USER_INFO + constants.SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['errors', 'updateSelectedUserInfo'], false) 
    case constants.UPDATE_SELECTED_USER_INFO + constants.FAIL:
      return state
        .setIn(['errors', 'updateSelectedUserInfo'], action.error.status)

    case constants.GET_CROINFORM_USER_INFO + constants.START:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
    case constants.GET_CROINFORM_USER_INFO + constants.SUCCESS:
      return state
        // .setIn(['companyResponse', 'heads'], payload)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['croinformInfoFl', action.loading], action.croinform)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case constants.GET_CROINFORM_USER_INFO + constants.FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], { status: action.error.status, message: action.error.message, time: action.error.time })

    case constants.LOAD_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'digestList'], true)
        .setIn(['errors', 'digestList'], false)
    case constants.LOAD_DIGEST_LIST + constants.SUCCESS:
      return state
        .set('risksSrc', action.risksSrc)
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], false) 
    case constants.LOAD_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], true)

    // Добавление нового риск-фактора в таблицу
    case constants.ADD_RISK_FACTOR_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], true)
        .setIn(['errors', 'addRistFactorInDigestList'], false)
    case constants.ADD_RISK_FACTOR_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], false) 
    case constants.ADD_RISK_FACTOR_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], true)

    // Редактирование выбранного риск фактора
    case constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление выбранного риск-фактора из таблицы
    case constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Получение данных о риск-факторах по проверяемому физику
    case constants.GET_RISK_FACTORS_FL_INFO + constants.START:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], true)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false)
    case constants.GET_RISK_FACTORS_FL_INFO + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false) 
    case constants.GET_RISK_FACTORS_FL_INFO + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], true)

    // Добавление нового риск фактора в дайджест лист
    case constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], true)
        .setIn(['errors', 'addRistFactorInDigestList'], false)
    case constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false) 
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], false) 
    case constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestList'], false)
        .setIn(['errors', 'addRistFactorInDigestList'], true)

    // Редактирование риск-фактора из дайджест листа
    case constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление риск фактора из дайджест листа
    case constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST + constants.FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Получение данных о вхождении в стоплисты ЮЛ кампании
    case constants.GET_STOP_LISTS_UL_INFO + constants.START:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], true)
        .setIn(['errors', 'getStopListsUl'], false)
    case constants.GET_STOP_LISTS_UL_INFO + constants.SUCCESS:
      return state
        .setIn(['companyResponse', 'stop_list'], payload)
        .setIn(['stopLists', action.loading], payload)
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], false) 
    case constants.GET_STOP_LISTS_UL_INFO + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getStopListsUl'], false)
        .setIn(['errors', 'getStopListsUl'], true)

    // Загрузка списка приложенных документов
    case constants.GET_DOCUMENTS + constants.START:
      return state
        .setIn(['requestLoading', 'getDocuments'], true)
        .setIn(['errors', 'getDocuments'], false)
    case constants.GET_DOCUMENTS + constants.SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], false) 
    case constants.GET_DOCUMENTS + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], true)

    // Загрузка документа с сервера
    case constants.GET_DOCUMENT_ITEM + constants.START:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], true)
        .setIn(['errors', 'getDocumentItem', action.loading], false)
    case constants.GET_DOCUMENT_ITEM + constants.SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], false) 
    case constants.GET_DOCUMENT_ITEM + constants.FAIL:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], true)

    case constants.GET_BLACK_STOP_LISTS + constants.START:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], true)
        .setIn(['errors', 'stopLists', action.loading], false)
    case constants.GET_BLACK_STOP_LISTS + constants.SUCCESS:
      return state
        .setIn(['stopLists', action.loading], action.stopLists)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], false) 
    case constants.GET_BLACK_STOP_LISTS + constants.FAIL:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], true)

    // Получение FSSP данных об проверяемом объекте
    case constants.GET_FSSP_INFO + constants.START:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], true)
        .setIn(['errors', 'fsspInfo', action.loading], false)
    case constants.GET_FSSP_INFO + constants.SUCCESS:
      return state
        .setIn(['fsspInfo', action.loading], action.fsspInfo)
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], false) 
    case constants.GET_FSSP_INFO + constants.FAIL:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], true)

    // Добавление нового лица в проверку
    case constants.ADD_USER_TO_CHECK_LIST:
      return state
        .mergeDeepIn(['companyResponse', 'heads'], [payload.newUser])

    case constants.CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}