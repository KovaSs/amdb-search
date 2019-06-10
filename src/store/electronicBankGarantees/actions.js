export const ACTION_CHANGE_EBG_INN = 'ACTION_CHANGE_EBG_INN'
export const actionChangeEBGInn = newInn => {
  return {
    type: ACTION_CHANGE_EBG_INN,
    payload: newInn
  }
}

export const LOADING_COMPANY_EBG_INFO = 'LOADING_COMPANY_EBG_INFO'
export const loadingCompanyEBGInfo = () => {
  return {
    type: LOADING_COMPANY_EBG_INFO,
    loading: true
  }
}

export const LOAD_COMPANY_EBG_INFO = 'LOAD_COMPANY_EBG_INFO'
export const loadCompanyEBGInfo = newCompanyInfo => {
  return {
    type: LOAD_COMPANY_EBG_INFO,
    payload: newCompanyInfo,
    loading : false
  }
}

export const CLEAR_COMPANY_EBG_INFO = 'CLEAR_COMPANY_EBG_INFO'
export const clearCompanyEBGInfo = () => {
  return {
    type: CLEAR_COMPANY_EBG_INFO
  }
}

