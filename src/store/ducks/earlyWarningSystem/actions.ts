import C from './constants'

/** Actions */
export const getMainData = (interval) => {
  return {
    type: C.GET_MAIN_DATA,
    payload: interval
  }
}
