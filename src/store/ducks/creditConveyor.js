export const moduleName = 'creditConveyor'
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

const creditConveyorReducer = (state = defaultState, action) => {
    const {type, payload, loading } = action
    switch (type) {
      case ACTION_CHANGE_INN:
        return { ...state, inn: payload };

      case LOAD_COMPANY_INFO + START:
        return { ...state, searchLoading: loading };
      case LOAD_COMPANY_INFO + SUCCESS:
        return { ...state, companyResponse: payload, callAPI : action.callAPI, searchLoading: loading, renderData: true };
      case LOAD_COMPANY_INFO + FAIL:
        return { ...state, searchLoading: false, errors: { companyMainInfo: true } };

      case CLEAR_COMPANY_INFO:
        return { ...state, inn: "", renderData: false };
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

export const loadCompanyInfo = () => {
  return dispatch => {
    dispatch({
      type: LOAD_COMPANY_INFO + START,
      loading: true
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

export default creditConveyorReducer