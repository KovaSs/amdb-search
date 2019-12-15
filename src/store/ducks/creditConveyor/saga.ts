import { all, put, call, select, take } from 'redux-saga/effects'
import C from './constants'
import { trasform } from "../../../services/utils"
import { sl } from './index'

/* Получение основных данных о кампании */
const loadCompanyInfoSaga = function * () {
  while(true){
    const action = yield take(C.LOAD_COMPANY_INFO)
    const api = { 
      type: 'get_company_info',
      data: {
        code: action.inn
      }
    }
    try {
      yield put({
        type: C.LOAD_COMPANY_INFO_UPDATE_START
      })
  
      const res = yield call(() => {
        return fetch(
          `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
          { 
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body : JSON.stringify(api),
          }
        )
        .then(res => {
          if (res.ok) return res.json()
          throw new TypeError("Данные о кампании не обновлены!")
        })
      })

      const data = res.data
      console.log('RES | first update | ', res)
      const store = yield select(sl.decodedCompanyResponse)
      const companyResponse = yield select(store)
      const updatedData = yield call(trasform.updateComSrc, companyResponse, data)
  
      yield put({
        type: C.LOAD_COMPANY_INFO_UPDATE_SUCCESS,
        id: res.reqnum,
        payload: {updatedData},
      })
    } catch (err){
      yield put({
        type: C.LOAD_COMPANY_INFO_UPDATE_FAIL,
      })
    }
  }
}


export const saga = function * () {
  yield all([
    loadCompanyInfoSaga()
  ])
}