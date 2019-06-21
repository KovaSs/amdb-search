import { START, SUCCESS, FAIL } from '../store/ducks/openBill'
import { trasform } from "../services/transformData"

export default store => next => action => {
  const { callAPI, updateData, type, updatePCInfo,  ...rest } = action
  if (!updateData && !callAPI) return next(action)

  updateData && next({ type: type + START, ...rest })
  updatePCInfo && next({ type: type + START, ...rest })

  /** Обновление актуальных данных о кампании */
  updateData && fetch(callAPI, { mode: 'cors', credentials: 'include' })
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
    .then(res => {
      const { openBill: { companyResponse } } = store.getState()
      const data = JSON.parse(res.data)
      console.log('RES | first update |', data.Data.Report)
      const updatedData = trasform._get_company_info_companySource(companyResponse, data.Data.Report)
      next({
        type: type + SUCCESS,
        reqnum: res.reqnum,
        payload: {updatedData},
        ...rest
      })
    })
    .catch(err => {
      console.log('err', err)
      next({
        type: type + FAIL,
      })
    })

  /** Обновление актуальных данных о пердшественниках кампании */
  updatePCInfo && fetch(callAPI, { mode: 'cors', credentials: 'include' })
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
    .then(res => {
      const { openBill: { companyResponse } } = store.getState()
      const data = JSON.parse(res.data)
      console.log('RES | PC', data)
      if(data.ResultInfo.ResultType === "Data not found") {
        const updatedData = trasform._get_company_info_companySource(companyResponse, { Successor : false, Predecessor: false})
        next({
          type: type + SUCCESS,
          reqnum: res.reqnum,
          payload: {updatedData},
          ...rest
        })
      } else {
        let updatedData = trasform._get_company_info_companySource(companyResponse, data.Data.Report.Reorganizations)
        next({
          type: type + SUCCESS,
          reqnum: res.reqnum,
          payload: {updatedData},
          ...rest
        })
      }
    })
    .catch(err => {
      console.log('ERR | PC', err)
      next({
        type: type + FAIL,
      })
    })
}