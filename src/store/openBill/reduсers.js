import { ACTION_CHANGE_OB_INN, LOAD_COMPANY_OB_INFO, CLEAR_COMPANY_OB_INFO, START, SUCCESS, UPDATE } from "./actions"

const defaultState = {
  inn: "",
  searchLoading: false
}

const creditConveyorReducer = (state = defaultState, action) => {
  const {type, payload, loading } = action
  switch (type) {
    case ACTION_CHANGE_OB_INN:
      return { ...state, inn: payload }
    case LOAD_COMPANY_OB_INFO + START:
      return { ...state, searchLoading: loading }
    case LOAD_COMPANY_OB_INFO + SUCCESS:
      return { ...state, companyResponse: payload }
    case LOAD_COMPANY_OB_INFO + UPDATE + START:
      return { ...state }
    case LOAD_COMPANY_OB_INFO + UPDATE + SUCCESS:
      return { ...state, companyResponse: payload, searchLoading: false, renderData: true}
    case CLEAR_COMPANY_OB_INFO:
      return { ...state, inn: "", renderData: false }
    default:
      return state
  }
}

export default creditConveyorReducer