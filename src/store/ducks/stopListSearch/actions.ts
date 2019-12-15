import C from './constants'

/** Actions */
// Поиск данных по
export const getSearchRequest = (post, type) => {
  return {
    type: C.GET_SEARCH_DATA,
    payload: {post, type}
  }
}

// Очистка всех данных перед следующим запросом
export const clearSearchData = () => {
  return {
    type: C.CLEAR_SEARCH_DATA
  }
}
