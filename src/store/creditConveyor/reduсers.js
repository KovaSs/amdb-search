import { ACTION_CHANGE_INN, ACTION_CHANGE_OGRN, LOADING_COMPANY_INFO, LOAD_COMPANY_INFO, CLEAR_COMPANY_INFO } from "./actions"

const defaultState = {
  inn: "",
  ogrn: "",
  searchLoading: false
}

const creditConveyorReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_INN:
      return { ...state, inn: action.payload };
    case ACTION_CHANGE_OGRN:
      return { ...state, ogrn: action.payload };
    case LOADING_COMPANY_INFO:
      return { ...state, searchLoading: action.loading };
    case LOAD_COMPANY_INFO:
      return { ...state, companyResponse: action.payload, searchLoading: action.loading, renderData: true };
    case CLEAR_COMPANY_INFO:
      return { ...state, renderData: action.payload };
    default:
      return state
  }
}

export default creditConveyorReducer