import C from './constants'

/** Actions */
// Установка ИНН проверяемой организации
export const actionChangeInn = inn => {
  return {
    type: C.ACTION_CHANGE_INN,
    payload: {inn}
  }
}
// Загрузка основных перевоначальных данных о кампании
export const loadCompanyInfo = inn => {
  return {
    type: C.LOAD_COMPANY_INFO,
    inn
  }
}
// Очистка всех данных перед следующим запросом
export const clearCompanyInfo = () => {
  return {
    type: C.CLEAR_COMPANY_INFO
  }
}
//Идентификация юзера для автозаполнения
export const addNewUserToCheackList = newUser => {
  return {
    type: C.ADD_USER_TO_CHECK_LIST,
    payload: {newUser},
  }
}
// Добавление нового риск-фактора
export const addRiskFactorFl = (factor, id) => {
  return {
    type: C.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора
export const editRiskFactorFl = (factor, id) => {
  return {
    type: C.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора
export const deleteRiskFactorFl = (factor, id) => {
  return {
    type: C.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: factor,
    loading: id
  }
}
// Добавление нового риск-фактора UL
export const addRiskFactorUl = (factor, info) => {
  return {
    type: C.ADD_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
  }
}
// Редактирование риск-фактора UL
export const editRiskFactorUl = (factor, info) => {
  return {
    type: C.EDIT_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
  }
}
// Добавление нового риск-фактора
export const deleteRiskUlFactor = (factor, info) => {
  return {
    type: C.DELETE_RISK_FACTOR_UL_IN_DIGEST_LIST,
    payload: factor,
    info
  }
}
// Обновление введенных идентификационных данных проверяемого лица
export const updateUserSelectedInfo = data => {
  return {
    type: C.UPDATE_SELECTED_USER_INFO,
    payload: data,
    id: data.id
  }
}
//Идентификация юзера для автозаполнения
export const identifyUser = data => {
  return {
    type: C.GET_IDENTIFY_USER,
    payload: data,
    id: data.id
  }
}
// Проверка юзера через Croinform
export const actionGetUserCroinformInfo = (user, id) => {
  return {
    type: C.GET_CROINFORM_USER_INFO,
    payload: user,
    loading: id
  }
}
// Проверка юзера через Croinform
export const getDocument = doc => {
  return {
    type: C.GET_DOCUMENT_ITEM,
    payload: doc
  }
}
// Проверка юзера через Croinform
export const takeEbgItem = data => {
  return {
    type: C.TAKE_EBG_ITEM,
    payload: data
  }
}
// Проверка юзера через Croinform
export const returnEbgItem = data => {
  return {
    type: C.RETURN_EBG_ITEM,
    payload: data
  }
}
// Проверка юзера через Croinform
export const acceptEbgItem = data => {
  return {
    type: C.ACCEPT_EBG_ITEM,
    payload: data
  }
}
// Ручное обновление списка риск-факторов
export const updateDigets = () => {
  return {
    type: C.LOAD_DIGEST_LIST
  }
}
// Ручное обновление списка риск-факторов foundersUl
export const updateDigetsUl = ({ inn,  id, storeCompName, reqnum }) => {
  return {
    type: C.LOAD_DIGEST_LIST_UL,
    inn, 
    id,
    storeCompName,
    reqnum
  }
}
// Проверка юзера через Croinform
export const updateDigetsFl = (user, reqnum) => {
  return {
    type: C.GET_RISK_FACTORS_FL_INFO,
    user,
    reqnum
  }
}
// Формирование и загрузка отчета по проверке
export const downloadReport = ({checkType, key}) => {
  return {
    type: C.DOWNLOAD_REPORT_FILE,
    checkType,
    key
  }
}
