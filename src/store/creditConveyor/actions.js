export const ACTION_CHANGE_INN = 'ACTION_CHANGE_INN'
export const actionChangeInn = newInn => {
  return {
    type: ACTION_CHANGE_INN,
    payload: newInn
  }
}

export const ACTION_CHANGE_OGRN = 'ACTION_CHANGE_OGRN'
export const actionChangeOgrn = newOgrn => {
  return {
    type: ACTION_CHANGE_OGRN,
    payload: newOgrn
  }
}
