import { ACTION_CHANGE_OB_INN, LOAD_COMPANY_OB_INFO, CLEAR_COMPANY_OB_INFO, START, SUCCESS, UPDATE, FAIL, PC } from "./actions"

const defaultState = {
  inn: "",
  requestLoading: false
}

const openBillReducer = (state = defaultState, action) => {
  const { requestLoading, errors } = state
  const {type, payload, loading, id} = action
  switch (type) {
    case ACTION_CHANGE_OB_INN:
      return { ...state, inn: payload }

    case LOAD_COMPANY_OB_INFO + START:
      return { ...state, requestLoading: { ...requestLoading, companyMainInfo: true }, errors: {...errors, companyMainInfo: false} }
    case LOAD_COMPANY_OB_INFO + SUCCESS:
      return { ...state, companyResponse: payload, requestLoading: { ...requestLoading, companyMainInfo: false }, errors: {...errors, companyMainInfo: false} }
    case LOAD_COMPANY_OB_INFO + FAIL:
      return { ...state, requestLoading: loading, errors: {...errors, companyMainInfo: true}}

    case LOAD_COMPANY_OB_INFO + UPDATE + START:
      return { ...state, reqnum: id, requestLoading: {...requestLoading, companyMainInfoUpdate: true}, errors: {...errors, companyMainInfoUpdate: false}}
    case LOAD_COMPANY_OB_INFO + UPDATE + SUCCESS:
      return { ...state, companyResponse: payload, requestLoading: {...requestLoading, companyMainInfoUpdate: false}, renderData: true, errors: {...errors, companyMainInfoUpdate: false}}
    case LOAD_COMPANY_OB_INFO + UPDATE + FAIL:
      return { ...state, requestLoading: {...requestLoading, companyMainInfoUpdate: false}, errors: {...errors, companyMainInfoUpdate: true}}

    case LOAD_COMPANY_OB_INFO + PC + UPDATE + SUCCESS:
      return { ...state, ps: payload}

    case CLEAR_COMPANY_OB_INFO:
      return { ...state, inn: "", reqnum: null, renderData: false }

    default:
      return state
  }
}

export default openBillReducer