import { START, SUCCESS, FAIL } from '../store/openBill/actions'
import { trasform } from "../services/transformData"

export default store => next => action => {
  const { callAPI, updateData, type, ...rest } = action
  if (!updateData && !callAPI) return next(action)

  updateData && next({ type: type + START, ...rest })

  /** Симуляция получения данных о кампании с сервера */
  updateData && fetch(callAPI, { mode: 'cors', credentials: 'include' })
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Oops, we haven't got JSON!")
    })
    .then(res => {
      const { openBill: { companyResponse } } = store.getState()
      const data = JSON.parse(res.data)
      // console.log('res', data.Data.Report.LegalAddresses)
      const updatedData = trasform._get_company_info_companySource(companyResponse, data.Data.Report)
      next({
        type: type + SUCCESS,
        reqnum: res.reqnum,
        payload: updatedData,
        ...rest
      })
    })
    .catch(err => {
      console.log('err', err)
      next({
        type: type + FAIL
      })
    })
}