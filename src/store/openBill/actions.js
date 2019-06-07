export const ACTION_CHANGE_OB_INN = 'ACTION_CHANGE_OB_INN'
export const actionChangeOpenBillInn = newInn => {
  return {
    type: ACTION_CHANGE_OB_INN,
    payload: newInn
  }
}

export const ACTION_CHANGE_OB_OGRN = 'ACTION_CHANGE_OB_OGRN'
export const actionChangeOpenBillOgrn = newOgrn => {
  return {
    type: ACTION_CHANGE_OB_OGRN,
    payload: newOgrn
  }
}

export const LOADING_COMPANY_OB_INFO = 'LOADING_COMPANY_OB_INFO'
export const loadingCompanyOpenBillInfo = () => {
  return {
    type: LOADING_COMPANY_OB_INFO,
    loading: true
  }
}

export const LOAD_COMPANY_OB_INFO = 'LOAD_COMPANY_OB_INFO'
export const loadCompanyOpenBillInfo = newCompanyInfo => {
  return {
    type: LOAD_COMPANY_OB_INFO,
    payload: newCompanyInfo,
    loading : false
  }
}

export const CLEAR_COMPANY_OB_INFO = 'CLEAR_COMPANY_OB_INFO'
export const clearCompanyOpenBillInfo = () => {
  return {
    type: CLEAR_COMPANY_OB_INFO
  }
}

