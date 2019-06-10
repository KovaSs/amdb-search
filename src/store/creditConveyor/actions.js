export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const FAIL = '_FAIL'

export const ACTION_CHANGE_CC_INN = 'ACTION_CHANGE_CC_INN'
export const actionChangeInn = newInn => {
  return {
    type: ACTION_CHANGE_CC_INN,
    payload: newInn
  }
}

export const ACTION_CHANGE_CC_OGRN = 'ACTION_CHANGE_CC_OGRN'
export const actionChangeOgrn = newOgrn => {
  return {
    type: ACTION_CHANGE_CC_OGRN,
    payload: newOgrn
  }
}

export const LOADING_COMPANY_CC_INFO = 'LOADING_COMPANY_CC_INFO'
export const loadingCompanyInfo = () => {
  return {
    type: LOADING_COMPANY_CC_INFO,
    loading: true
  }
}

export const LOAD_COMPANY_CC_INFO = 'LOAD_COMPANY_CC_INFO'
export const loadCompanyInfo = () => {
  return dispatch => {
    dispatch({
      type: LOAD_COMPANY_CC_INFO + START,
      loading: true
    })

    fetch('/cgi-bin/serg/0/6/9/reports/276/mock.pl')
    .then(res => res.json())
    .then(res => 
      dispatch({
        type: LOAD_COMPANY_CC_INFO + SUCCESS,
        payload : res,
        loading : false
      })
    )
  }
}

export const CLEAR_COMPANY_CC_INFO = 'CLEAR_COMPANY_CC_INFO'
export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_CC_INFO
  }
}

