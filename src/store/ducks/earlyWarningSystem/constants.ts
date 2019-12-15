import config from '../../../config'

export const moduleName = 'earlyWarningSystem'
const prefix = `${config.appName}/${moduleName}`

const actionTypeBase = {
  GET_MAIN_DATA: `${prefix}/GET_MAIN_DATA`,
  GET_MAIN_DATA_START: `${prefix}/GET_MAIN_DATA_START`,
  GET_MAIN_DATA_SUCCESS: `${prefix}/GET_MAIN_DATA_SUCCESS`,
  GET_MAIN_DATA_FAIL: `${prefix}/GET_MAIN_DATA_FAIL`,

  CLEAR_COMPANY_INFO: `${prefix}/CLEAR_COMPANY_INFO`,
}

const constants: Readonly<typeof actionTypeBase> = actionTypeBase;
export default constants;
