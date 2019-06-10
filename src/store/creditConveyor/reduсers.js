import { ACTION_CHANGE_CC_INN, ACTION_CHANGE_CC_OGRN, LOADING_COMPANY_CC_INFO, LOAD_COMPANY_CC_INFO, CLEAR_COMPANY_CC_INFO, SUCCESS } from "./actions"

const defaultState = {
  inn: "",
  searchLoading: false
}

const creditConveyorReducer = (state = defaultState, action) => {
  const {type, payload, loading } = action
  switch (type) {
    case ACTION_CHANGE_CC_INN:
      return { ...state, inn: payload };
    case ACTION_CHANGE_CC_OGRN:
      return { ...state, ogrn: payload };
    case LOADING_COMPANY_CC_INFO:
      return { ...state, searchLoading: loading };
    case LOAD_COMPANY_CC_INFO + SUCCESS:
      return { ...state, companyResponse: payload, callAPI : action.callAPI, searchLoading: loading, renderData: true };
    case CLEAR_COMPANY_CC_INFO:
      return { ...state, inn: "", renderData: false };
    default:
      return state
  }
}

export default creditConveyorReducer