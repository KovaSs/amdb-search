import { Record, Map } from 'immutable'
import C from './constants'

/** Reducer */
const ReducerRecord = Record({
  mainData: [],
  requestLoading: Map({
    mainData: false,
  }),
  errors: Map({
    mainData: false,
  })
})

export const earlyWarningSystemReducer = (state = new ReducerRecord(), action) => {
  const { type, payload } = action
  switch (type) {
    // Получение основных данных
    case C.GET_MAIN_DATA_START:
      return state
        .setIn(['requestLoading', 'mainData'], true)
        .setIn(['errors', 'mainData'], false)      
    case C.GET_MAIN_DATA_SUCCESS:
      return state
        .set('mainData', payload)
        .setIn(['requestLoading', 'mainData'], false)
        .setIn(['errors', 'mainData'], false) 
    case C.GET_MAIN_DATA_FAIL:
      return state
        .setIn(['requestLoading', 'mainData'], false)
        .setIn(['errors', 'mainData'], true)

    case C.CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}