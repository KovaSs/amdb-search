// import { data } from '../mock'
// const { companyRequest : { inn, ogrn } } = data;
import { ACTION_CHANGE_INN, ACTION_CHANGE_OGRN } from "./actions"

const defaultState = {
  address: "",
  befenicials: "",
  capital: "",
  fouldersFl: "",
  fouldersUl: "",
  fullName: "",
  inn: "",
  menegmentCompany: "",
  name: "",
  ogrn: "",
  okved: "",
  precessors: "",
  status: "",
  succesors: ""
}

const creditConveyorReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTION_CHANGE_INN:
    return { ...state, inn: action.payload};
    case ACTION_CHANGE_OGRN:
    return { ...state, ogrn: action.payload};
  }
  return state
}

export default creditConveyorReducer