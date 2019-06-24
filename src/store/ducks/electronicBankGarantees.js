// import { Record } from 'immutable'

// const ReducerRecord = Record({
// user: null,
// error: null,
// loading: false
// })

export const moduleName = 'electronicBankGarantees'
export const prefix = `AS-Check/${moduleName}`

export const ACTION_CHANGE_INN = `${prefix}/ACTION_CHANGE_INN`
export const LOAD_COMPANY_INFO = `${prefix}/LOAD_COMPANY_INFO`
export const LOADING_COMPANY_INFO = `${prefix}/LOADING_COMPANY_INFO`
export const CLEAR_COMPANY_INFO = `${prefix}/CLEAR_COMPANY_INFO`

const defaultState = {
  inn: "",
  storeLoading: false
}

const electronicBankGarantiesReducer = (state = defaultState, action) => {
  const {type, payload, loading } = action
  switch (type) {
    case ACTION_CHANGE_INN:
      return { ...state, inn: payload };
    case LOADING_COMPANY_INFO:
      return { ...state, storeLoading: loading };
    case LOAD_COMPANY_INFO:
      return { ...state, companyResponse: payload, storeLoading: loading, renderData: true };
    case CLEAR_COMPANY_INFO:
      return { ...state, inn: "", renderData: false };
    default:
      return state
  }
}

export const actionChangeEBGInn = newInn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: newInn
  }
}

export const loadingCompanyEBGInfo = () => {
  return {
    type: LOADING_COMPANY_INFO,
    loading: true
  }
}

export const loadCompanyEBGInfo = newCompanyInfo => {
  return {
    type: LOAD_COMPANY_INFO,
    payload: newCompanyInfo,
    loading : false
  }
}

export const clearCompanyEBGInfo = () => {
  return {
    type: CLEAR_COMPANY_INFO
  }
}

export default electronicBankGarantiesReducer