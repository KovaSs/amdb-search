import { ACTION_CHANGE_OB_INN, LOAD_COMPANY_OB_INFO, CLEAR_COMPANY_OB_INFO, START, SUCCESS, UPDATE, FAIL, PC } from "./actions"

const defaultState = {
  inn: "",
  searchLoading: false
}

const creditConveyorReducer = (state = defaultState, action) => {
  const {type, payload, loading, id} = action
  switch (type) {
    case ACTION_CHANGE_OB_INN:
      return { ...state, inn: payload }
    case LOAD_COMPANY_OB_INFO + START:
      return { ...state, searchLoading: loading }
    case LOAD_COMPANY_OB_INFO + SUCCESS:
      return { ...state, companyResponse: payload }
    case LOAD_COMPANY_OB_INFO + FAIL:
      return { ...state, searchLoading: loading, errorUpdate: true}
    case LOAD_COMPANY_OB_INFO + UPDATE + START:
      return { ...state, reqnum: id}
    case LOAD_COMPANY_OB_INFO + UPDATE + SUCCESS:
      return { ...state, companyResponse: payload, searchLoading: false, renderData: true}
    case LOAD_COMPANY_OB_INFO + UPDATE + FAIL:
      return { ...state, searchLoading: false, errorUpdate: true}
    case LOAD_COMPANY_OB_INFO + PC + UPDATE + SUCCESS:
      return { ...state, ps: payload}
    case CLEAR_COMPANY_OB_INFO:
      return { ...state, inn: "", reqnum: null, renderData: false }
    default:
      return state
  }
}

export default creditConveyorReducer