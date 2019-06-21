import { Record } from 'immutable'
import { companyRes } from '../mock'

export const moduleName = 'openBill'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`

export const PC = '_PC'
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const UPDATE = '_UPDATE'
export const FAIL = '_FAIL'

const ReducerRecord = Record({
  inn: "",
  reqnum: 1,
  renderData: false,
  companyResponse: null,
  requestLoading: {
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  },
  errors: {
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  }
})

const openBillReducer = (state = new ReducerRecord(), action) => {
  const { requestLoading, errors } = state
  const { type, payload, id } = action
  switch (type) {
    case ACTION_CHANGE_INN:
      return state.set('inn', payload.inn)

    case LOAD_COMPANY_INFO:
      return state
        .set('companyResponse', payload.company)

    case LOAD_COMPANY_INFO + UPDATE + START:
      return state
        .set('reqnum', id)
        .set('requestLoading', {...requestLoading, companyMainInfoUpdate: true})
        .set('errors', {...errors, companyMainInfoUpdate: false})      
    case LOAD_COMPANY_INFO + UPDATE + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .set('requestLoading', {...requestLoading, companyMainInfoUpdate: false})
        .set('renderData', true)
        .set('errors', {...errors, companyMainInfoUpdate: false}) 
    case LOAD_COMPANY_INFO + UPDATE + FAIL:
      return state
        .set('requestLoading', {...requestLoading, companyMainInfoUpdate: false})
        .set('renderData', false)
        .set('errors', {...errors, companyMainInfoUpdate: true})

    case LOAD_COMPANY_INFO + PC + UPDATE + START:
      return state
        .set('reqnum', id)
        .set('requestLoading', {...requestLoading, companyPCUpdate: true})
        .set('errors', {...errors, companyPCUpdate: false})    
    case LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS:
      return state
        .set('companyResponse', payload.updatedData)
        .set('requestLoading', {...requestLoading, companyPCUpdate: false})
        .set('errors', {...errors, companyPCUpdate: false}) 
    case LOAD_COMPANY_INFO + PC + UPDATE + FAIL:
      return state
        .set('requestLoading', {...requestLoading, companyPCUpdate: false})
        .set('renderData', false)
        .set('errors', {...errors, companyPCUpdate: true})

    case CLEAR_COMPANY_INFO:
      return new ReducerRecord()

    default:
      return state
  }
}

export const actionChangeInn = inn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: {inn}
  }
}

export const loadCompanyInfo = inn => {
  return dispatch => {
    dispatch({
      type: LOAD_COMPANY_INFO,
      payload: {company: companyRes}
    })

    dispatch({
      type: LOAD_COMPANY_INFO + UPDATE,
      callAPI: `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl?request=${JSON.stringify({ type: 'get_company_info', data : { code: inn } })}`,
      updateData: true
    })

    dispatch({
      type: LOAD_COMPANY_INFO + PC + UPDATE,
      callAPI: `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl?request=${JSON.stringify({ type: 'get_company_ps', reqnum: 1, data : { code: inn } })}`,
      updatePCInfo: true
    })
  }
}

export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}

export default openBillReducer