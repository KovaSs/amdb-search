// import {companyResponse} from '../mock'

export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const FAIL = '_FAIL'
export const UPDATE = '_UPDATE'
export const PC = '_PC'

export const ACTION_CHANGE_OB_INN = 'ACTION_CHANGE_OB_INN'
export const actionChangeInn = newInn => {
  return {
    type: ACTION_CHANGE_OB_INN,
    payload: newInn
  }
}

export const LOAD_COMPANY_OB_INFO = 'LOAD_COMPANY_OB_INFO'
export const loadCompanyInfo = inn => {
  return dispatch => {
    dispatch({
      type: LOAD_COMPANY_OB_INFO + START,
      loading: true
    })

    
    dispatch({
      type: LOAD_COMPANY_OB_INFO + UPDATE,
      callAPI : `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl?request=${JSON.stringify({ 
        type: 'get_company_info',
        data : {
          code: inn
        }
      })}`,
      updateData: true
    })

    dispatch({
      type: LOAD_COMPANY_OB_INFO + PC + UPDATE,
      callAPI : `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl?request=${JSON.stringify({ 
        type: 'get_company_ps',
        reqnum: '0',
        data : {
          code: inn
        }
      })}`
    })

    fetch('/cgi-bin/serg/0/6/9/reports/276/mock.pl', { mode: 'cors', credentials: 'include' })
    .then(res => {
      console.log('res', res)
      if(res.ok) {
        return res.json()
      } else {
        throw new TypeError("Oops, we haven't got JSON!")
      }
    })
    .then(res => {
      return dispatch({
        type: LOAD_COMPANY_OB_INFO + SUCCESS,
        payload : companyResponse,
        loading : false
      })
    }
    )
    .catch(err => {
      console.log('err', err)
      return dispatch({
        type: LOAD_COMPANY_OB_INFO + FAIL,
        loading : false
      })
    })
  }
}

export const CLEAR_COMPANY_OB_INFO = 'CLEAR_COMPANY_OB_INFO'
export const clearCompanyInfo = () => {
  return {
    type: CLEAR_COMPANY_OB_INFO
  }
}

