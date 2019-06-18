// import { Record } from 'immutable'

// const ReducerRecord = Record({
// user: null,
// error: null,
// loading: false
// })

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

const defaultState = {
  inn: "",
  requestLoading: false,
  errors: {
    companyMainInfo: false, 
    companyMainInfoUpdate: false, 
    companyPCUpdate: false
  }
}

const openBillReducer = (state = defaultState, action) => {
  const { requestLoading, errors } = state
  const {type, payload, loading, id} = action
  switch (type) {
    case ACTION_CHANGE_INN:
      return { ...state, inn: payload }

    case LOAD_COMPANY_INFO + START:
      return { ...state, requestLoading: {...requestLoading, companyMainInfo: loading }, errors: {...errors, companyMainInfo: false} }
    case LOAD_COMPANY_INFO + SUCCESS:
      return { ...state, companyResponse: payload, requestLoading: { ...requestLoading, companyMainInfo: false }, errors: {...errors, companyMainInfo: false} }
    case LOAD_COMPANY_INFO + FAIL:
      return { ...state, requestLoading: loading, errors: {...errors, companyMainInfo: true}}

    case LOAD_COMPANY_INFO + UPDATE + START:
      return { ...state, reqnum: id, requestLoading: {...requestLoading, companyMainInfoUpdate: true}, errors: {...errors, companyMainInfoUpdate: false}}
    case LOAD_COMPANY_INFO + UPDATE + SUCCESS:
      return { ...state, companyResponse: payload, requestLoading: {...requestLoading, companyMainInfoUpdate: false}, renderData: true, errors: {...errors, companyMainInfoUpdate: false}}
    case LOAD_COMPANY_INFO + UPDATE + FAIL:
      return { ...state, requestLoading: {...requestLoading, companyMainInfoUpdate: false}, errors: {...errors, companyMainInfoUpdate: true}}

    case LOAD_COMPANY_INFO + PC + UPDATE + START:
      return { ...state, reqnum: id, requestLoading: {...requestLoading, companyPCUpdate: true}, errors: {...errors, companyPCUpdate: false}}
    case LOAD_COMPANY_INFO + PC + UPDATE + SUCCESS:
      return { ...state, companyResponse: payload, requestLoading: {...requestLoading, companyPCUpdate: false}, errors: {...errors, companyPCUpdate: false}}
    case LOAD_COMPANY_INFO + PC + UPDATE + FAIL:
      return { ...state, requestLoading: {...requestLoading, companyPCUpdate: false}, errors: {...errors, companyPCUpdate: true}}

    case CLEAR_COMPANY_INFO:
      return { ...state, inn: "", reqnum: null, renderData: false }

    default:
      return state
  }
}



export const actionChangeInn = newInn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: newInn
  }
}

export const loadCompanyInfo = inn => {
  return dispatch => {
    dispatch({
      type: LOAD_COMPANY_INFO + START,
      loading: true
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

    fetch('/cgi-bin/serg/0/6/9/reports/276/mock.pl', {
        mode: 'cors',
        credentials: 'include'
      })
      .then(res => {
        if (res.ok)  return res.json() 
        throw new TypeError("Основные данные о кампании не загружены!")
      })
      .then(res => {
        return dispatch({
          type: LOAD_COMPANY_INFO + SUCCESS,
          payload: res,
          loading: false
        })
      })
      .catch(err => {
        console.log('err', err)
        return dispatch({
          type: LOAD_COMPANY_INFO + FAIL,
          loading: false
        })
      })
  }
}

export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}

export default openBillReducer