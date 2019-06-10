import { START, SUCCESS } from '../store/creditConveyor/actions'

/** Получение данных из mock data */
import { companyResponse } from "../store/mock";

export default store => next => action => {
  const { callAPI, type, ...rest } = action
  if (!callAPI) return next(action)

  next({
    type: type + START,
    ...rest
  })
  /** Симуляция получения данных о кампании с сервера */
  fetch(callAPI)
    .then(res => res.json())
    .then(res => console.log('test ->', res))
  
    next({ type: type + SUCCESS, payload: companyResponse, ...rest})
}