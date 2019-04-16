import { data } from '../mock'

const { web : { lessons } } = data

const defaultState = {
  data : lessons
}

const lessonReducer = (state = defaultState, actions) => {
  return state
}


export default lessonReducer



