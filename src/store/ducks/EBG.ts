import { Map, OrderedMap } from 'immutable'
import { put, call, takeEvery, select, spawn, all, fork } from 'redux-saga/effects'
import C from './constants'
import { trasform, cloCss } from "../../../services/utils"
import { API } from '../../../services/api'
import { companyRes } from '../../mock'

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * (action) {
  try {
    yield put({
      type: C.LOAD_COMPANY_INFO_START
    })
    // Запрос на получение основных данных о кампании
    const res = yield call(API.getLoadCompanyInfo, action.inn, 4)

    const data = res.data.company_info
    console.log("%cRES | FIRST UPDATE", cloCss.green, res)

    // Проверка является ли проверяемый объект ИП
    if(res.data.ip && res.status.success) {
      const updatedData = yield call(trasform.updateIPComSrc, yield select(companyImmutableResSelector), data, res.reqnum)
      yield put({
        type: C.LOAD_COMPANY_INFO_SUCCESS,
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
        type: C.LOAD_COMPANY_INFO_SUCCESS,
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
        type: C.LOAD_COMPANY_INFO_FAIL,
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
      type: C.LOAD_COMPANY_INFO_FAIL,
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
      type: C.LOAD_COMPANY_INFO_UL_START,
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
        type: C.LOAD_COMPANY_INFO_UL_SUCCESS,
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
        type: C.LOAD_COMPANY_INFO_UL_FAIL,
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
      type: C.LOAD_COMPANY_INFO_UL_FAIL,
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
      prevSelected: Map({}),
      managment: param
    })
    console.log('%cSTORE', cloCss.info, updatedStore)

    yield put({
      type: C.UPDATE_HEADS,
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
      type: C.GET_STOP_LISTS_UL_INFO_START,
      keyId: key
    })

    /* Запрос данных о приемниках */
    const res = yield call(API.getStopLists, { ulinn, type: 'ul', method: 'bases' }, reqnum, 4)
    console.log("%cRES | GET STOP LIST UL",  cloCss.green, res)
    const clearedData = res.data && res.data.length ? clearStopListsArr(res.data) : []

    yield put({
      type: C.GET_STOP_LISTS_UL_INFO_SUCCESS,
      payload: clearedData,
      keyId: key
    })
  } catch (err){
    console.log('%cgetStopListsUlSagaErr', cloCss.red, err)
    yield put({
      type: C.GET_STOP_LISTS_UL_INFO_FAIL,
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
      type: C.GET_BLACK_STOP_LISTS_START,
      loading: user.id
    })

    /* Запрос данных о стоп-листах */
    const res = yield call(API.getStopListFl, action, yield select(decodedReqnum), 4)
    console.log("%cRES | GET BLACK STOP LISTS ",  cloCss.green, res)

    if(res.data && res.data.length && res.Status !== "Error") {
      const stopLists = yield call(trasform.updateStopListArr, res.data)

      yield put({
        type: C.GET_BLACK_STOP_LISTS_SUCCESS,
        timeRequest: Date.now(),
        stopLists,
        loading: user.id
      })
    } else if(res.Status === "Error") {
      console.log('%cgetBlackStopListSaga@Err', cloCss.red, res.Description)
      yield put({
        type: C.GET_BLACK_STOP_LISTS_FAIL,
        loading: user.id
      })
    }

  } catch (err){
    console.log('%cgetBlackStopListSagaErr', cloCss.red, err)
    yield put({
      type: C.GET_BLACK_STOP_LISTS_FAIL,
      loading: user.id
    })
  }
}

/* Получение данных о риск-факторах */
const loadDigestListUlSaga = function * (action) {
  try {
    yield put({
      type: C.LOAD_DIGEST_LIST_UL_START,
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
      type: C.LOAD_DIGEST_LIST_UL_SUCCESS,
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