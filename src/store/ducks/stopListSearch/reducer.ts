import { Record, Map } from 'immutable'
import C from './constants'

/** Reducer */
const ReducerRecord = Record({
  searchRequest: null,
  searchData: [],
  requestLoading: Map({
    getSearchData: false,
  }),
  errors: Map({
    getSearchData: null,
    message: null
  })
})

export const stopListSearchReducer = (state = new ReducerRecord(), action) => {
  const { type, payload } = action
  switch (type) {
    // Получение основных данных
    case C.GET_SEARCH_DATA_START:
      return state
        .setIn(['requestLoading', 'getSearchData'], true)
        .setIn(['errors', 'getSearchData'], false)      
    case C.GET_SEARCH_DATA_SUCCESS:
      return state
        .set('searchData', payload)
        .set('searchRequest', action.search)
        .setIn(['requestLoading', 'getSearchData'], false)
        .setIn(['errors', 'getSearchData'], false) 
    case C.GET_SEARCH_DATA_FAIL:
      return state
        .setIn(['requestLoading', 'getSearchData'], false)
        .setIn(['errors', 'getSearchData'], false)

      case C.REGISTER_ERROR:
        return state
          .setIn(['errors', 'message'], payload)

    case C.CLEAR_SEARCH_DATA:
      return new ReducerRecord()

    default:
      return state
  }
}