/** Получение данных из mock data */
import { companyResponse } from "../store/mock";

export default store => next => action => {
  const { callAPI } = action
  if (!callAPI) return next(action)
  /** Симуляция получения данных о кампании с сервера */
  next({...action, payload: companyResponse})
}