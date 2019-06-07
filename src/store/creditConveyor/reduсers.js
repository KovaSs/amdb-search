import { ACTION_CHANGE_CC_INN, ACTION_CHANGE_CC_OGRN, LOADING_COMPANY_CC_INFO, LOAD_COMPANY_CC_INFO, CLEAR_COMPANY_CC_INFO } from "./actions"

const defaultState = {
  inn: "",
  searchLoading: false
}

const creditConveyorReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_CC_INN:
      return { ...state, inn: action.payload };
    case ACTION_CHANGE_CC_OGRN:
      return { ...state, ogrn: action.payload };
    case LOADING_COMPANY_CC_INFO:
      return { ...state, searchLoading: action.loading };
    case LOAD_COMPANY_CC_INFO:
      return { ...state, companyResponse: action.payload, searchLoading: action.loading, renderData: true };
    case CLEAR_COMPANY_CC_INFO:
      return { ...state, inn: "", renderData: false };
    default:
      return state
  }
}

export default creditConveyorReducer