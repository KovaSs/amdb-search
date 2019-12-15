import C from './constants'
import { companyRes } from '../../mock'

/** Actions */
export const actionChangeInn = inn => {
  return {
    type: C.ACTION_CHANGE_INN,
    payload: {inn}
  }
}

export const loadCompanyInfo = inn => {
  return {
    type: C.LOAD_COMPANY_INFO,
    payload: {company: companyRes},
    inn
  }
}

export const clearCompanyInfo = () => {
  return {
    type: C.CLEAR_COMPANY_INFO
  }
}