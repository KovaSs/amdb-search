import { ACTION_CHANGE_OB_INN, ACTION_CHANGE_OB_OGRN, LOADING_COMPANY_OB_INFO, LOAD_COMPANY_OB_INFO, CLEAR_COMPANY_OB_INFO } from "./actions"

const defaultState = {
  inn: "",
  searchLoading: false
}

const openBillReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_OB_INN:
      return { ...state, inn: action.payload };
    case ACTION_CHANGE_OB_OGRN:
      return { ...state, ogrn: action.payload };
    case LOADING_COMPANY_OB_INFO:
      return { ...state, searchLoading: action.loading };
    case LOAD_COMPANY_OB_INFO:
      return { ...state, companyResponse: action.payload, searchLoading: action.loading, renderData: true };
    case CLEAR_COMPANY_OB_INFO:
      return { ...state, inn: "", renderData: false };
    default:
      return state
  }
}

export default openBillReducer