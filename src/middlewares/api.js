import { START, SUCCESS } from '../store/openBill/actions'

export default store => next => action => {
  const { callAPI, updateData, type, ...rest } = action
  if (!updateData && !callAPI) return next(action)

  next({
    type: type + START,
    ...rest
  })
  /** Симуляция получения данных о кампании с сервера */
  fetch(callAPI, { mode: 'cors', credentials: 'include' })
  .then(res => res.json())
  .then(res => {
    const data = JSON.parse(res.data)
    console.log('res', data.Data.Report)
    next({ type: type + SUCCESS, payload: data.Data.Report, ...rest})
  })
}