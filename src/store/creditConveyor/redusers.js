import { data } from '../mock'

const { companyRequest : { inn, ogrn } } = data;

const defaultState = {
  inn,
  ogrn
}

const creditConveyorReducer = (state = defaultState, actions) => {
  return state
}


export default creditConveyorReducer