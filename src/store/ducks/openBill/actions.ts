import constants from './constants'

/** Actions */
// Установка ИНН проверяемой организации
export const actionChangeInn = inn => {
  return {
    type: constants.ACTION_CHANGE_INN,
    payload: {inn}
  }
}

// Загрузка основных перевоначальных данных о кампании
export const loadCompanyInfo = inn => {
  return {
    type: constants.LOAD_COMPANY_INFO,
    inn
  }
}

// Очистка всех данных перед следующим запросом
export const clearCompanyInfo = () => {
  return {
    type: constants.CLEAR_COMPANY_INFO
  }
}

//Идентификация юзера для автозаполнения
export const addNewUserToCheackList = newUser => {
  console.log('newUser', newUser)
  return {
    type: constants.ADD_USER_TO_CHECK_LIST,
    payload: {newUser},
  }
}

// Добавление нового риск-фактора
export const addRiskFactor = factor => {
  return {
    type: constants.ADD_RISK_FACTOR_IN_DIGEST_LIST,
    payload: {...factor}
  }
}

// Добавление нового риск-фактора
export const editRiskFactor = factor => {
  return {
    type: constants.EDIT_RISK_FACTOR_IN_DIGEST_LIST,
    payload: {...factor}
  }
}

// Добавление нового риск-фактора
export const deleteRiskFactor = factor => {
  return {
    type: constants.DELETE_RISK_FACTOR_IN_DIGEST_LIST,
    payload: {...factor}
  }
}

// Добавление нового риск-фактора
export const addRiskFactorFl = (factor, id) => {
  return {
    type: constants.ADD_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}

// Добавление нового риск-фактора
export const editRiskFactorFl = (factor, id) => {
  return {
    type: constants.EDIT_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}

// Добавление нового риск-фактора
export const deleteRiskFactorFl = (factor, id) => {
  return {
    type: constants.DELETE_RISK_FACTOR_FL_IN_DIGEST_LIST,
    payload: {...factor},
    loading: id
  }
}

// Обновление введенных идентификационных данных проверяемого лица
export const updateUserSelectedInfo = data => {
  return {
    type: constants.UPDATE_SELECTED_USER_INFO,
    payload: data,
    id: data.id
  }
}

//Идентификация юзера для автозаполнения
export const identifyUser = data => {
  return {
    type: constants.GET_IDENTIFY_USER,
    payload: data,
    id: data.id
  }
}

// Проверка юзера через Croinform
export const actionGetUserCroinformInfo = (user, id) => {
  return {
    type: constants.GET_CROINFORM_USER_INFO,
    payload: {...user},
    loading: id
  }
}

// Проверка юзера через Croinform
export const getDocument = doc => {
  return {
    type: constants.GET_DOCUMENT_ITEM,
    payload: doc
  }
}

// Проверка юзера через Croinform
export const updateDigets = () => {
  return {
    type: constants.LOAD_DIGEST_LIST
  }
}

// Проверка юзера через Croinform
export const updateDigetsFl = (user, reqnum) => {
  return {
    type: constants.GET_RISK_FACTORS_FL_INFO,
    user,
    reqnum
  }
}

// Формирование и загрузка отчета по проверке
export const downloadReport = ({checkType, key}) => {
  return {
    type: constants.DOWNLOAD_REPORT_FILE,
    checkType,
    key
  }
}