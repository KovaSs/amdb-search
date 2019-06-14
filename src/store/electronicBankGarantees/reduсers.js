import { ACTION_CHANGE_EBG_INN, LOADING_COMPANY_EBG_INFO, LOAD_COMPANY_EBG_INFO, CLEAR_COMPANY_EBG_INFO } from "./actions"

const defaultState = {
  inn: "",
  storeLoading: false
}

const electronicBankGarantiesReducer = (state = defaultState, action) => {
  const {type, payload, loading } = action
  switch (type) {
    case ACTION_CHANGE_EBG_INN:
      return { ...state, inn: payload };
    case LOADING_COMPANY_EBG_INFO:
      return { ...state, storeLoading: loading };
    case LOAD_COMPANY_EBG_INFO:
      return { ...state, companyResponse: payload, storeLoading: loading, renderData: true };
    case CLEAR_COMPANY_EBG_INFO:
      return { ...state, inn: "", renderData: false };
    default:
      return state
  }
}

export default electronicBankGarantiesReducer