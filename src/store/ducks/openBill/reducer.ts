import { Record, Map, OrderedMap } from 'immutable'
import { uuid } from "../../../services/utils"
import { companyRes } from '../../mock'

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