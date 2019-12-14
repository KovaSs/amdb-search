import { all, put, call, select, spawn, takeEvery } from 'redux-saga/effects'
import constants from './constants'
import { API } from '../../../services/api'
import { 
  trasform, 
  clearStopListsArr, 
  getShortCompName,
  dowloadHtmlFile, 
  cloCss 
} from "../../../services/utils"
import * as sl from './selectors'

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * (action) {
  try {
    yield put({
      type: constants.LOAD_COMPANY_INFO_START
    })
    // Запрос на получение основных данных о кампании
    const res = yield call(API.getLoadCompanyInfo, action.inn, 2)
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)

    if(res.data.ip && res.status.success) {
      yield call(loadDigestListSaga)
      const updatedData = yield call(trasform.updateIPComSrc, yield select(sl.decodedCompanyResponse), {
        ...res.data.company_info, 
        history_identify: res.data.history_identify
      })
      yield put({
        type: constants.LOAD_COMPANY_INFO_SUCCESS,
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
      const updatedData = yield call(trasform.updateComSrc, yield select(sl.decodedCompanyResponse), {
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
        type: constants.LOAD_COMPANY_INFO_SUCCESS,
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
        type: constants.LOAD_COMPANY_INFO_FAIL,
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
      type: constants.LOAD_COMPANY_INFO_FAIL,
      error: {
        status: true,
        time: Date.now(),
        message: "Данные о кампании не получены, пожалуйста повторите запрос" 
      }
    })
  }
}

/* Поиск исторических данных риск-факторов о ЮЛ */
const getRiskFactorsNewUserSaga = function * ({payload: {newUser: user}}: any) {
  const factors = yield select(sl.storeLoading)
  if(factors.has(user.id)) return
  try {
    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_START,
      loading: user.id
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getRiskFactorsFl, yield select(sl.decodedReqnum), user, 2)
    console.log("%cRES | GET RISK FACTORS FL",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(sl.ebgHeads),
      factors: res.data, 
      id: user.id
    })

    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_SUCCESS,
      riskFactors: riskFactors,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetRiskFactorsFlSaga@Err', cloCss.red, err)
    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_FAIL,
      loading: user.id
    })
  }
}

/* Поиск данных стоп-листов о ЮЛ */
const getStopListsUlSaga = function * (ulinn, reqnum) {
  try {
    yield put({
      type: constants.GET_STOP_LISTS_UL_INFO_START
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getStopLists, { ulinn, type: 'ul', method: 'bases' }, reqnum, 2)
    console.log("%cRES | GET STOP LIST UL",  cloCss.green, res)
    const clearedData = res.data && res.data.length ? clearStopListsArr(res.data) : []

    yield put({
      type: constants.GET_STOP_LISTS_UL_INFO_SUCCESS,
      payload: clearedData,
      loading: yield select(sl.storeKey)
    })
  } catch (err){
    console.log('%cgetStopListsUlSaga@Err', cloCss.red, err)
    yield put({
      type: constants.GET_STOP_LISTS_UL_INFO_FAIL,
    })
  }
}

/* Поиск данных стоп-листов о ЮЛ */
const getDocumentItemSaga = function * (action) {
  try {
    yield put({
      type: constants.GET_DOCUMENT_ITEM_START,
      loading: action.payload.xhdoc
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getDocumentItem, yield select(sl.decodedReqnum), action.payload.xhdoc)
    console.log("%cRES | GET DOCUMENT",  cloCss.green, res)

    const updatedData = yield call(trasform.updateDocuments, yield select(sl.storeDoc), res, action.payload.xhdoc)

    yield put({
      type: constants.GET_DOCUMENT_ITEM_SUCCESS,
      payload: updatedData,
      loading: action.payload.xhdoc
    })
  } catch (err){
    console.log('%getDocumentItem@Saga', cloCss.red, err)
    yield put({
      type: constants.GET_DOCUMENT_ITEM_FAIL,
      loading: action.payload.xhdoc
    })
  }
}

/* Получение данных о связанных лицах */
const loadAffilatesListSaga = function * () {
  const isIp = yield select(sl.decodedisIp)
  if(!isIp) {
    try {
      yield put({
        type: constants.GET_AFFILATES_LIST_START
      })

      /* Запрос данных о приемниках */
      const res = yield call(API.getAffilatesList, yield select(sl.decodedReqnum), yield select(sl.storeInn), 2)
      console.log("%cRES | GET AFFILATES LIST",  cloCss.green, res)

      const updatedData = yield call(trasform.updateManagmentSrc, yield select(sl.decodedCompanyResponse), res.data)
      const selectedInfo = yield call(trasform.historySelectedInfo, {
        prevHeads: yield updatedData.get("heads"), 
        historyIdentify: yield select(sl.storeHistoryIdentify), 
        storeSelInfoFl: yield select(sl.storeSelectedInfoFl)
      })

      if(updatedData.get("heads").length) {
        yield all(updatedData.get("heads").map(item =>  spawn(getRiskFactorsFlSaga, {
          user: item,
          reqnum: res.reqnum
        })))
      }

      yield put({
        type: constants.GET_AFFILATES_LIST_SUCCESS,
        payload: {
          updatedData,
          selectedInfo
        },
      })
      yield spawn(loadAffilatesUlSaga, updatedData)
    } catch (err){
      console.log('%cloadAffilatesListSaga@Err', cloCss.red, err)
      yield put({
        type: constants.GET_AFFILATES_LIST_FAIL,
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
  const heads = yield select(sl.ebgHeads)
  const user = heads.find(item => item.id === action.loading)
  yield spawn(getFsspInfoSaga, yield select(sl.decodedReqnum), action, user)
  // Стоп-листы
  yield spawn(getStopListSaga, user, action.payload)
}

/* Поиск пользователя в стоп-листах по Дате рождения */
const getStopListSaga = function * (user, action) {
  try {
    yield put({
      type: constants.GET_BLACK_STOP_LISTS_START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getStopListFl, action, yield select(sl.decodedReqnum), 2)
    console.log("%cRES | GET BLACK STOP LISTS ",  cloCss.green, res)

    if(res.data && res.data.length && res.Status !== "Error") {
      const stopLists = yield call(trasform.updateStopListArr, res.data)
      yield put({
        type: constants.GET_BLACK_STOP_LISTS_SUCCESS,
        timeRequest: Date.now(),
        stopLists,
        loading: user.id
      })
    } else if(res.Status === "Error") {
      console.log('%cgetBlackStopListSaga@Err', cloCss.red, res.Description)
      yield put({
        type: constants.GET_BLACK_STOP_LISTS_FAIL,
        loading: user.id
      })
    }

  } catch (err){
    console.log('%cgetBlackStopListSagaErr', cloCss.red, err)
    yield put({
      type: constants.GET_BLACK_STOP_LISTS_FAIL,
      loading: user.id
    })
  }
}

/* Получение данных о риск-факторах */
const loadDigestListSaga = function * () {
  try {
    yield put({
      type: constants.LOAD_DIGEST_LIST_START
    })

    /* Запрос данных для DigetsList */
    const res = yield call(API.getDigestList, yield select(sl.decodedReqnum), 2)
    console.log("%cRES | LOAD DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(sl.storeInn), 
        name: yield select(sl.decodedCompanyName)
      }
    })

    yield put({
      type: constants.LOAD_DIGEST_LIST_SUCCESS,
      risksSrc: res.data.risks,
      riskFactors: riskFactors,
      loading: yield select(sl.storeKey)
    })
  } catch (err){
    console.log('%cloadDigestListSaga@Err', cloCss.red, err)
    yield put({
      type: constants.LOAD_DIGEST_LIST_FAIL,
    })
  }
}

/* Поиск исторических данных риск-факторов о ЮЛ */
const getRiskFactorsFlSaga = function * ({user, reqnum}: any) {
  try {
    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_START,
      loading: user.id
    })

    /* Запрос данных по истории риск-факторов */
    const res = yield call(API.getRiskFactorsFl, reqnum, user, 2)
    console.log("%cRES | GET RISK FACTORS FL",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(sl.ebgHeads),
      factors: res.data, 
      id: user.id
    })

    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_SUCCESS,
      riskFactors: riskFactors,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetRiskFactorsFlSaga@Err', cloCss.red, err)
    yield put({
      type: constants.GET_RISK_FACTORS_FL_INFO_FAIL,
      loading: user.id
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: constants.ADD_RISK_FACTOR_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactor, yield select(sl.decodedReqnum), action.payload, 2)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(sl.storeInn), 
        name: yield select(sl.decodedCompanyName)
      }
    })

    yield put({
      type: constants.ADD_RISK_FACTOR_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(sl.storeKey)
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.ADD_RISK_FACTOR_IN_DIGEST_LIST_FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.editRiskFactorRequest, yield select(sl.decodedReqnum), action.payload)
    console.log("%cRES | EDIT RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(sl.storeInn), 
        name: yield select(sl.decodedCompanyName)
      }
    })

    yield put({
      type: constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(sl.storeKey)
    })
  } catch (err){
    console.log('%editRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST_FAIL,
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorSaga = function * (action) {
  try {
    yield put({
      type: constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactor, yield select(sl.decodedReqnum), action.payload)
    console.log("%cRES | DELETE RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsUl, {
      factors: res.data,
      info: {
        inn: yield select(sl.storeInn), 
        name: yield select(sl.decodedCompanyName)
      }
    })

    yield put({
      type: constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: yield select(sl.storeKey)
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST_FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const addRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getAddRiskFactorFl, yield select(sl.decodedReqnum), action.payload, 2)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(sl.ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL,
    })
  }
}

/* Добавление нового риск-фактора в DigetsList */
const editRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.editRiskFactorFlRequest, yield select(sl.decodedReqnum), action.payload, 2)
    console.log("%cRES | EDIT RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(sl.ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%caddRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL,
    })
  }
}

/* Удаление риск-фактора в DigetsList */
const deleteRiskFactorFlSaga = function * (action) {
  try {
    yield put({
      type: constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_START
    })

    /* Запрос на добавление нового риск-фактора  */
    const res = yield call(API.getDeleteRiskFactorFl, yield select(sl.decodedReqnum), action.payload)
    console.log("%cRES | ADD RISK FACTOR IN DIGEST LIST",  cloCss.green, res)

    const riskFactors = yield call(trasform.saveRiskFaktorsFl, {
      heads: yield select(sl.ebgHeads),
      factors: res.data, 
      id: action.loading
    })

    yield put({
      type: constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_SUCCESS,
      riskFactors: riskFactors,
      loading: action.loading
    })
  } catch (err){
    console.log('%cdeleteRiskFactorSaga@Err', cloCss.red, err)
    yield put({
      type: constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST_FAIL,
    })
  }
}

const getRequestAffiliatesUlSaga = function * (inn, user) {
  try {
    yield put({
      type: constants.GET_AFFILATES_UL_START,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getRequestAffiliatesUl, yield select(sl.decodedReqnum), inn, 2)
    console.log("%cRES | GET CHECK AFFILATES UL",  cloCss.green, res)

    const updatedData = yield call(trasform.updateManagmentULSrc, yield select(sl.ebgHeads), res.data, user)

    if(updatedData.length) {
      yield all(updatedData.map(item =>  spawn(getRiskFactorsFlSaga, {
        user: item,
        reqnum: res.reqnum
      })))
    }
    const selectedInfo = yield call(trasform.historySelectedInfo, {
      prevHeads: updatedData, 
      historyIdentify: yield select(sl.storeHistoryIdentify), 
      storeSelInfoFl: yield select(sl.decodedCompanyResponse)
    })

    yield put({
      type: constants.GET_AFFILATES_UL_SUCCESS,
      payload: {
        updatedData,
        selectedInfo
      },
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  } catch (err){
    console.log('%cgetRequestAffiliatesUlSaga@Err', cloCss.red, err)
    yield put({
      type: constants.GET_AFFILATES_UL_FAIL,
      loading: {inn, name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}
    })
  }
}

/* Идентификация пользователя */
const updateUserSelectedInfoSaga = function * (action) {
  try {
    yield put({
      type: constants.UPDATE_SELECTED_USER_INFO_SUCCESS,
      selected: action.payload.user,
      loading: action.id
    })

  } catch (err){
    console.log('%cupdateUserSelectedInfoSaga@Err', cloCss.red, err)
    yield put({
      type: constants.UPDATE_SELECTED_USER_INFO_FAIL,
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
      type: constants.GET_IDENTIFY_USER_START,
      selected: action.payload.user,
      loading: action.id
    })

    /* Запрос на идентификацию проверяемого объекта */
    const res = yield call(API.getIdentifyUser, 
      yield select(sl.decodedisIp), 
      yield select(sl.decodedReqnum), 
      action.payload.user
    )
    console.log("%cRES | GET USER INFO",  cloCss.green, res)

    if(res.data) {
      yield put({
        type: constants.GET_IDENTIFY_USER_SUCCESS,
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
      type: constants.GET_IDENTIFY_USER_FAIL,
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
      type: constants.GET_CROINFORM_USER_INFO_START,
      selected: action.payload,
      loading: action.loading,
    })

    /* Переключение на mock данные */
    const res = yield call(API.getIdentifyUserInfo, yield select(sl.decodedReqnum), action.payload, 2)
    console.log("%cRES | GET CROINFORM USER INFO |", cloCss.green, res)

    const croinform = yield call(trasform.croinformInfoResponse,
      {
        html: res.data.html,
        lists: res.data.lists,
        vector: res.data.parse_ci_request.vektor_fl
      }
    )

    yield put({
      type: constants.GET_CROINFORM_USER_INFO_SUCCESS,
      timeRequest: Date.now(),
      croinform,
      loading: action.loading
    })

    const heads = yield select(sl.ebgHeads)

    yield call(loadStopListDataSaga, action)
    yield call(getRiskFactorsFlSaga, {
      user: yield heads.find(item => item.id === action.loading),
      reqnum: res.reqnum
    })
  } catch (err){
    console.log('%cgetCroinformInfoSaga@Err', cloCss.red, err)
    const { FirstName, MiddleName, SurName } = action.payload
    yield put({
      type: constants.GET_CROINFORM_USER_INFO_FAIL,
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
      type: constants.GET_FSSP_INFO_START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getFsspInfo, reqnum, action.payload, 2)
    console.log("%cRES | GET FSSP INFO",  cloCss.green, res)

    const fsspInfo = yield call(trasform.clearedFsspInfo, res.data.html)

    yield put({
      type: constants.GET_FSSP_INFO_SUCCESS,
      fsspInfo,
      loading: user.id
    })
  } catch (err){
    console.log('%cgetFsspInfoSaga@Err', cloCss.red, err)
    yield put({
      type: constants.GET_FSSP_INFO_FAIL,
      loading: user.id
    })
  }
}

/* Поиск приклепленных к проверке документов */
const getDocumentsSaga = function * (reqnum, inn) {
  try {
    yield put({
      type: constants.GET_DOCUMENTS_START
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getDocuments, reqnum, inn)
    console.log("%cRES | GET DOCUMENTS",  cloCss.green, res)

    yield put({
      type: constants.GET_DOCUMENTS_SUCCESS,
      payload: res.data,
    })
  } catch (err){
    console.log('%getDocuments@Saga', cloCss.red, err)
    yield put({
      type: constants.GET_DOCUMENTS_FAIL,
    })
  }
}

/* Сохранение отчета по результатам проверки в виде HTML файла */
const downloadReportFileSaga = function * (action) {
  try {
    yield put({
      type: constants.DOWNLOAD_REPORT_FILE_START
    })

    /* Формирование и сохранение отчета по данным на проверяемый объект */
    if(action.checkType) {
      // Для сохранения дайджеста по физическому лицу
      yield call(dowloadHtmlFile, {
        isFl: true,
        info: (yield select(sl.ebgHeads)).find(item => item.id === action.key).fio,
        identify:  (yield select(sl.storeIdentifyInfoFl)).has(action.key) ? (yield select(sl.storeIdentifyInfoFl)).get(action.key).html : null,
        croinform:  (yield select(sl.storeCroinformInfoFl)).has(action.key) ? (yield select(sl.storeCroinformInfoFl)).get(action.key).html : null,
        lists: (yield select(sl.storeCroinformInfoFl)).has(action.key) ? (yield select(sl.storeCroinformInfoFl)).get(action.key).lists : null,
        vector:  (yield select(sl.storeCroinformInfoFl)).has(action.key) ? (yield select(sl.storeCroinformInfoFl)).get(action.key).vector : null,
        stopLists: (yield select(sl.storeStopLists)).has(action.key) ? (yield select(sl.storeStopLists)).get(action.key) : null,
        fsspInfo: (yield select(sl.storeFsspInfo)).has(action.key) ? (yield select(sl.storeFsspInfo)).get(action.key) : null,
        digets: (yield select(sl.storeRiskFactors)).has(action.key) ? (yield select(sl.storeRiskFactors)).get(action.key).digets : null,
        risks: yield select(sl.storeRisksSrc)
      })
    } else {
      // Для сохранения дайджеста по юридическому лицу
      yield call(dowloadHtmlFile, {
        isFl: false,
        info: yield select(sl.decodedCompanyName),
        mainKey: yield select(sl.storeKey),
        headsFl: yield select(sl.ebgHeads),
        mainDigets: (yield select(sl.storeMainDigest)).digets,
        digets: yield select(sl.storeRiskFactors),
        risks: yield select(sl.storeRisksSrc),
        identify:  yield select(sl.storeIdentifyInfoFl),
        croinform:  yield select(sl.storeCroinformInfoFl),
        stopLists: yield select(sl.storeStopLists),
        fsspInfo: yield select(sl.storeFsspInfo),
        riskSource: yield select(sl.decodedRiskSource)
      })
    }

    yield put({
      type: constants.DOWNLOAD_REPORT_FILE_SUCCESS,
    })
  } catch (err){
    console.log('%cgetDocuments@Saga', cloCss.red, err)
    yield put({
      type: constants.DOWNLOAD_REPORT_FILE_FAIL,
    })
  }
}

export const saga = function * () {
  yield takeEvery(constants.LOAD_COMPANY_INFO, loadCompanyInfoSaga)
  yield takeEvery(constants.LOAD_DIGEST_LIST, loadDigestListSaga)
  yield takeEvery(constants.GET_RISK_FACTORS_FL_INFO, getRiskFactorsFlSaga)
  yield takeEvery(constants.GET_DOCUMENT_ITEM, getDocumentItemSaga)
  yield takeEvery(constants.UPDATE_SELECTED_USER_INFO, updateUserSelectedInfoSaga)
  yield takeEvery(constants.ADD_RISK_FACTOR_IN_DIGEST_LIST, addRiskFactorSaga)
  yield takeEvery(constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST, editRiskFactorSaga)
  yield takeEvery(constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST, deleteRiskFactorSaga)
  yield takeEvery(constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST, addRiskFactorFlSaga)
  yield takeEvery(constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST, editRiskFactorFlSaga)
  yield takeEvery(constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST, deleteRiskFactorFlSaga)
  yield takeEvery(constants.ADD_USER_TO_CHECK_LIST, getRiskFactorsNewUserSaga)
  yield takeEvery(constants.GET_IDENTIFY_USER, identifyUserSaga)
  yield takeEvery(constants.GET_CROINFORM_USER_INFO, getCroinformInfoSaga)
  yield takeEvery(constants.DOWNLOAD_REPORT_FILE, downloadReportFileSaga)
}