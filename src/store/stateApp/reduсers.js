import { ACTION_CHANGE_APP_ACTIVE_PAGE } from "./actions"

const defaultState = {
  page: null,
}

const stateAppReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_APP_ACTIVE_PAGE:
      return { ...state, page: action.payload};
    default:
      return state
  }
}

export default stateAppReducer