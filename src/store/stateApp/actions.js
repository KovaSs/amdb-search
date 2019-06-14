export const ACTION_CHANGE_APP_ACTIVE_PAGE = 'ACTION_CHANGE_APP_ACTIVE_PAGE'
export const actionChangeNumberPage = numberPage => {
  return {
    type: ACTION_CHANGE_APP_ACTIVE_PAGE,
    payload: numberPage
  }
}
