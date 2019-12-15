import { Record, Map, OrderedMap } from 'immutable'
import C from './constants'
import { uuid } from "../../../services/utils"
import { companyRes } from '../../mock'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  mainObjectKey: null,
  isIp: false,
  reqnum: '',
  renderData: false,
  ebgData: null,
  risksSrc: [],
  croinformInfoFl: Map({}),
  identifyInfoFl: Map({}),
  selectedInfoFl: Map({}),
  fsspInfo: Map({}),
  stopLists: Map({}),
  riskFactors: Map({}),
  timeRequest: Map({}),
  ebgMainResponse: null,
  companyResponse: OrderedMap({ ...companyRes, key: uuid()}),
  companyResponseUl: OrderedMap({}),
  requestLoading: Map({
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
    deleteRistFactorInDigestListUl: Map({}),
    addRistFactorInDigestListFl: Map({}),
    addRistFactorInDigestListUl: Map({}),
    getStopListsUl: Map({}),
    digestListUl: Map({}),
    loadCompanyInfoUl: Map({}),
    getDocumentItem: Map({}),
    getRiskFactorsFl: Map({}),
    stopLists: Map({}),
    fsspInfo: Map({}),
    getAffilatesUl: Map({}),
    identifyUser: Map({}),
    croinformRequest: Map({})
  }),
  errors: Map({
    acceptEbgItemRequest: false,
    returnEbgItemRequest: false,
    ebgMainDataRequest: false,
    ebgSyncTableData: false,
    companyMainInfo: false, 
    getDocuments: false,
    companyMainInfoUpdate: false, 
    getAffilatesList: false,
    digestList: false,
    addRistFactorInDigestListFl:  Map({}),
    deleteRistFactorInDigestList: false,
    updateSelectedUserInfo: false,
    deleteRistFactorInDigestListUl: Map({}),
    addRistFactorInDigestListUl: Map({}),
    getStopListsUl: Map({}),
    digestListUl: Map({}),
    loadCompanyInfoUl: Map({}),
    getDocumentItem: Map({}),
    getRiskFactorsFl: Map({}),
    stopLists: Map({}),
    fsspInfo: Map({}),
    getAffilatesUl: Map({}),
    identifyUser: Map({}),
    croinformRequest: Map({})
  })
})

const EbgReducer = (state = new ReducerRecord(), action) => {
  const { type, payload, id } = action
  switch (type) {
    // Сохранение данных поискового запроса
    case C.ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    // Обновление данных о руководителях и связанных лицах
    case C.UPDATE_HEADS:
      return state
        .set('selectedInfoFl', action.updatedStore.selected)
        .setIn(['companyResponse', 'heads'], action.updatedStore.heads)

    // Взятие выбранного из EBG таблицы объекта на проверку
    case C.TAKE_EBG_ITEM_START:
      return state
        .setIn(['requestLoading', 'ebgMainDataRequest'], true)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'ebgMainDataRequest'], false)
    case C.TAKE_EBG_ITEM_SUCCESS:
      return state
        .set('ebgMainResponse', payload.json)
        .setIn(['companyResponse', 'founders_ul'],  payload.foundersUl)
        .setIn(['errors', 'ebgMainDataRequest'], false)
    case C.TAKE_EBG_ITEM_FAIL:
      return state
        .setIn(['requestLoading', 'ebgMainDataRequest'], false)
        .setIn(['errors', 'ebgMainDataRequest'], true)

    // Возврат в очередь EBG проверки
    case C.RETURN_EBG_ITEM_START:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], true) 
        .setIn(['errors', 'returnEbgItemRequest'], false)
    case C.RETURN_EBG_ITEM_SUCCESS:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], false)
        .setIn(['errors', 'returnEbgItemRequest'], false)
    case C.RETURN_EBG_ITEM_FAIL:
      return state
        .setIn(['requestLoading', 'returnEbgItemRequest'], false)
        .setIn(['errors', 'returnEbgItemRequest'], true)

    // Завершение Ebg проверки по проверяемому объекту
    case C.ACCEPT_EBG_ITEM_START:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], true) 
        .setIn(['errors', 'acceptEbgItemRequest'], false)
    case C.ACCEPT_EBG_ITEM_SUCCESS:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], false)
        .setIn(['errors', 'acceptEbgItemRequest'], false)
    case C.ACCEPT_EBG_ITEM_FAIL:
      return state
        .setIn(['requestLoading', 'acceptEbgItemRequest'], false)
        .setIn(['errors', 'acceptEbgItemRequest'], true)

    // Обновление основных данных по кампании
    case C.LOAD_COMPANY_INFO_START:
      return state
        .set('reqnum', id)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'companyMainInfoUpdate'], false)      
    case C.LOAD_COMPANY_INFO_SUCCESS:
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
    case C.LOAD_COMPANY_INFO_FAIL:
      return state
        .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
        .setIn(['errors', 'companyMainInfoUpdate'], { status: action.error.status, message: action.error.message, time: action.error.time })
        .set('renderData', false)

    // Обновление основных данных по связанным UL кампаниям
    case C.LOAD_COMPANY_INFO_UL_START:
      return state
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], true)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], false)     
    case C.LOAD_COMPANY_INFO_UL_SUCCESS:
      return state
        .setIn(['companyResponseUl', action.id], payload.updatedData)
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], false)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], false) 
    case C.LOAD_COMPANY_INFO_UL_FAIL:
      return state
        .setIn(['requestLoading', 'loadCompanyInfoUl', action.id], false)
        .setIn(['errors', 'loadCompanyInfoUl', action.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Сохранение данных об аффилированных лицах
    case C.GET_AFFILATES_LIST_START:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], true)
        .setIn(['errors', 'getAffilatesList'], false)      
    case C.GET_AFFILATES_LIST_SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], false) 
    case C.GET_AFFILATES_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesList'], false)
        .setIn(['errors', 'getAffilatesList'], true)

    // Сохранение данных об аффилированных лицах связанных ЮЛ
    case C.GET_AFFILATES_UL_START:
      return state
      .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: true, name: action.loading.name})
      .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name})      
    case C.GET_AFFILATES_UL_SUCCESS:
      return state
        .setIn(['companyResponse', 'heads'], payload.updatedData)
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: false, name: action.loading.name}) 
    case C.GET_AFFILATES_UL_FAIL:
      return state
        .setIn(['requestLoading', 'getAffilatesUl', action.loading.inn], {loading: false, name: action.loading.name})
        .setIn(['errors', 'getAffilatesUl', action.loading.inn], {error: true, name: action.loading.name})

    // Получение идентификационных данных на выбранное ФЛ
    case C.GET_IDENTIFY_USER_START:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'identifyUser', action.loading], true)
        .setIn(['errors', 'identifyUser', action.loading], false)
    case C.GET_IDENTIFY_USER_SUCCESS:
      return state
        .setIn(['identifyInfoFl', action.loading], action.info)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'identifyUser', action.loading], false)
        .setIn(['errors', 'identifyUser', action.loading], false) 
    case C.GET_IDENTIFY_USER_FAIL:
      return state
        .setIn(['requestLoading', 'identifyUser', action.error.id], false)
        .setIn(['errors', 'identifyUser', action.error.id], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Сохранение данных введеных пользователем
    case C.UPDATE_SELECTED_USER_INFO_SUCCESS:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['errors', 'updateSelectedUserInfo'], false) 
    case C.UPDATE_SELECTED_USER_INFO_FAIL:
      return state
        .setIn(['errors', 'updateSelectedUserInfo'], action.error.status)

    // Финальная проверка выбранного ФЛ
    case C.GET_CROINFORM_USER_INFO_START:
      return state
        .setIn(['selectedInfoFl', action.loading], action.selected)
        .setIn(['requestLoading', 'croinformRequest', action.loading], true)
        .setIn(['errors', 'croinformRequest', action.loading], false)
    case C.GET_CROINFORM_USER_INFO_SUCCESS:
      return state
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['croinformInfoFl', action.loading], action.croinform)
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], false) 
    case C.GET_CROINFORM_USER_INFO_FAIL:
      return state
        .setIn(['requestLoading', 'croinformRequest', action.loading], false)
        .setIn(['errors', 'croinformRequest', action.loading], { status: action.error.status, message: action.error.message, time: action.error.time })

    // Получение ФССП данных
    case C.GET_FSSP_INFO_START:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], true)
        .setIn(['errors', 'fsspInfo', action.loading], false)
    case C.GET_FSSP_INFO_SUCCESS:
      return state
        .setIn(['fsspInfo', action.loading], action.fsspInfo)
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], false) 
    case C.GET_FSSP_INFO_FAIL:
      return state
        .setIn(['requestLoading', 'fsspInfo', action.loading], false)
        .setIn(['errors', 'fsspInfo', action.loading], true)

    // Получение исторических и актуальных риск-факторов
    case C.LOAD_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'digestList'], true)
        .setIn(['errors', 'digestList'], false)
    case C.LOAD_DIGEST_LIST_SUCCESS:
      return state
        .set('risksSrc', action.risksSrc)
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], false) 
    case C.LOAD_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'digestList'], false)
        .setIn(['errors', 'digestList'], true)

    // Загрузка данных по риск факторам ЮЛ
    case C.LOAD_DIGEST_LIST_UL_START:
      return state
        .setIn(['requestLoading', 'digestListUl', action.id], true)
        .setIn(['errors', 'digestListUl', action.id], false)
    case C.LOAD_DIGEST_LIST_UL_SUCCESS:
      return state
        .set('risksSrc', action.risksSrc)
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'digestListUl', action.id], false)
        .setIn(['errors', 'digestListUl', action.id], false) 
    case C.LOAD_DIGEST_LIST_UL_FAIL:
      return state
        .setIn(['requestLoading', 'digestListUl', action.id], false)
        .setIn(['errors', 'digestListUl', action.id], true)

    // Добавление риск фактора в дайджест лист UL
    case C.ADD_RISK_FACTOR_UL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case C.ADD_RISK_FACTOR_UL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case C.ADD_RISK_FACTOR_UL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Редактирование риск фактора в дайджест лист UL
    case C.EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case C.EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case C.EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Удаление риск фактора в дайджест лист UL
    case C.DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case C.DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.id], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case C.DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Редактирование риск-фактора из дайджест листа ФЛ
    case C.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], true)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], false)
    case C.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], false)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], false) 
    case C.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'addRistFactorInDigestListFl', action.loading], false)
        .setIn(['errors', 'addRistFactorInDigestListFl', action.loading], true)

    // Редактирование риск-фактора из дайджест листа ФЛ
    case C.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case C.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case C.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)
    
    // Удвление риск-фактора из дайджест листа ФЛ   
    case C.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_START:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], true)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false)
    case C.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], false) 
    case C.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL:
      return state
        .setIn(['requestLoading', 'deleteRistFactorInDigestList'], false)
        .setIn(['errors', 'deleteRistFactorInDigestList'], true)

    // Получение данных по стоп-листам ЮЛ
    case C.GET_STOP_LISTS_UL_INFO_START:
      return state
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], true)
        .setIn(['errors', 'getStopListsUl', action.keyId], false)
    case C.GET_STOP_LISTS_UL_INFO_SUCCESS:
      return state
        .setIn(['stopLists', action.keyId], payload)
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], false)
        .setIn(['errors', 'getStopListsUl', action.keyId], false) 
    case C.GET_STOP_LISTS_UL_INFO_FAIL:
      return state
        .setIn(['requestLoading', 'getStopListsUl', action.keyId], false)
        .setIn(['errors', 'getStopListsUl', action.keyId], true)

    // Загрузка списка приложенных документов
    case C.GET_DOCUMENTS_START:
      return state
        .setIn(['requestLoading', 'getDocuments'], true)
        .setIn(['errors', 'getDocuments'], false)
    case C.GET_DOCUMENTS_SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], false) 
    case C.GET_DOCUMENTS_FAIL:
      return state
        .setIn(['requestLoading', 'getDocuments'], false)
        .setIn(['errors', 'getDocuments'], true)

    // Загрузка документа с сервера
    case C.GET_DOCUMENT_ITEM_START:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], true)
        .setIn(['errors', 'getDocumentItem', action.loading], false)
    case C.GET_DOCUMENT_ITEM_SUCCESS:
      return state
        .setIn(['companyResponse', 'documents'], payload)
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], false) 
    case C.GET_DOCUMENT_ITEM_FAIL:
      return state
        .setIn(['requestLoading', 'getDocumentItem', action.loading], false)
        .setIn(['errors', 'getDocumentItem', action.loading], true)
    
     // Получение данных по стоп-листам ФЛ
    case C.GET_BLACK_STOP_LISTS_START:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], true)
        .setIn(['errors', 'stopLists', action.loading], false)
    case C.GET_BLACK_STOP_LISTS_SUCCESS:
      return state
        .setIn(['stopLists', action.loading], action.stopLists)
        .setIn(['timeRequest', action.loading], action.timeRequest)
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], false) 
    case C.GET_BLACK_STOP_LISTS_FAIL:
      return state
        .setIn(['requestLoading', 'stopLists', action.loading], false)
        .setIn(['errors', 'stopLists', action.loading], true)

     // Получение данных по актуальным и историческим риск-факторам ФЛ
    case C.GET_RISK_FACTORS_FL_INFO_START:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], true)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false)
    case C.GET_RISK_FACTORS_FL_INFO_SUCCESS:
      return state
        .setIn(['riskFactors', action.loading], action.riskFactors)
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], false) 
    case C.GET_RISK_FACTORS_FL_INFO_FAIL:
      return state
        .setIn(['requestLoading', 'getRiskFactorsFl', action.loading], false)
        .setIn(['errors', 'getRiskFactorsFl', action.loading], true)

    // Синхранизация данных по ЭБГ
    case C.UPDATE_EBG_SYNC_DATA_START:
      return state
        .setIn(['requestLoading', 'ebgSyncTableData'], true)
        .setIn(['errors', 'ebgSyncTableData'], false)
    case C.UPDATE_EBG_SYNC_DATA_SUCCESS:
      return state
        .set('ebgData', payload)
        .setIn(['requestLoading', 'ebgSyncTableData'], false)
        .setIn(['errors', 'ebgSyncTableData'], false) 
    case C.UPDATE_EBG_SYNC_DATA_FAIL:
      return state
        .setIn(['requestLoading', 'ebgSyncTableData'], false)
        .setIn(['errors', 'ebgSyncTableData'], true)

    // Добавление нового лица в перечень связанных с кампанией лиц для проверки
    case C.ADD_USER_TO_CHECK_LIST:
      return state
        .mergeDeepIn(['companyResponse', 'heads'], [payload.newUser])

    // Чистка store приложения
    case C.CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}