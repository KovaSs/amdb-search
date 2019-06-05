export const ACTION_CHANGE_INN = 'ACTION_CHANGE_INN'
export const actionChangeInn = newInn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: newInn
  }
}

export const ACTION_CHANGE_OGRN = 'ACTION_CHANGE_OGRN'
export const actionChangeOgrn = newOgrn => {
  return {
    type: ACTION_CHANGE_OGRN,
    payload: newOgrn
  }
}

export const LOADING_COMPANY_INFO = 'LOADING_COMPANY_INFO'
export const loadingCompanyInfo = () => {
  return {
    type: LOADING_COMPANY_INFO,
    loading: true
  }
}

export const LOAD_COMPANY_INFO = 'LOAD_COMPANY_INFO'
export const loadCompanyInfo = newCompanyInfo => {
  return {
    type: LOAD_COMPANY_INFO,
    payload: newCompanyInfo,
    loading : false
  }
}

export const CLEAR_COMPANY_INFO = 'CLEAR_COMPANY_INFO'
export const clearCompanyInfo = newCompanyInfo => {
  return {
    type: CLEAR_COMPANY_INFO,
    payload: newCompanyInfo,
    loading : false
  }
}

