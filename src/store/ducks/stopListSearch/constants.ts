import config from '../../../config'

export const moduleName = 'stopListSearch'
const prefix = `${config.appName}/${moduleName}`

const actionTypeBase = {
  GET_SEARCH_DATA_START: `${prefix}/GET_SEARCH_DATA_START`,
  GET_SEARCH_DATA_SUCCESS: `${prefix}/GET_SEARCH_DATA_SUCCESS`,
  GET_SEARCH_DATA_FAIL: `${prefix}/GET_SEARCH_DATA_FAIL`,
  
  GET_SEARCH_DATA: `${prefix}/GET_SEARCH_DATA`,
  REGISTER_ERROR: `${prefix}/REGISTER_ERROR`,
  CLEAR_SEARCH_DATA: `${prefix}/CLEAR_SEARCH_DATA`,
}

const constants: Readonly<typeof actionTypeBase> = actionTypeBase;
export default constants;
