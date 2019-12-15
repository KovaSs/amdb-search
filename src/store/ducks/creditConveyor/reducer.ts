import { Record, Map } from 'immutable'
import C from './constants'

/** Reducer */
const ReducerRecord = Record({
  inn: "",
  reqnum: null,
  renderData: false,
  companyResponse: null,
  requestLoading: Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  }),
  errors: Map({
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  })
})

export const creditConveyorReducer = (state = new ReducerRecord(), action) => {
  const { type, payload, id } = action
  switch (type) {
    case C.ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    case C.LOAD_COMPANY_INFO:
      return state
        .set('companyResponse', payload.company)

      case C.LOAD_COMPANY_INFO_UPDATE_START:
        return state
        .set('reqnum', id)
        .setIn(['requestLoading', 'companyMainInfoUpdate'], true)
        .setIn(['errors', 'companyMainInfoUpdate'], false)      
      case C.LOAD_COMPANY_INFO_UPDATE_SUCCESS:
        return state
          .set('companyResponse', payload.updatedData)
          .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
          .setIn(['errors', 'companyMainInfoUpdate'], false) 
          .set('renderData', true)
          .set('reqnum', id)
      case C.LOAD_COMPANY_INFO_UPDATE_FAIL:
        return state
          .setIn(['requestLoading', 'companyMainInfoUpdate'], false)
          .setIn(['errors', 'companyMainInfoUpdate'], true)
          .set('renderData', false)

    case C.CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}