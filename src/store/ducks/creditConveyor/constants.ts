import config from '../../../config'

export const moduleName = 'creditConveyor'
const prefix = `${config.appName}/${moduleName}`

const actionTypeBase = {
  ACTION_CHANGE_INN: `${prefix}/ACTION_CHANGE_INN`,

  LOAD_COMPANY_INFO: `${prefix}/LOAD_COMPANY_INFO`,
  LOAD_COMPANY_INFO_UPDATE_START: `${prefix}/LOAD_COMPANY_INFO_UPDATE_START`,
  LOAD_COMPANY_INFO_UPDATE_SUCCESS: `${prefix}/LOAD_COMPANY_INFO_UPDATE_SUCCESS`,
  LOAD_COMPANY_INFO_UPDATE_FAIL: `${prefix}/LOAD_COMPANY_INFO_UPDATE_FAIL`,

  CLEAR_COMPANY_INFO: `${prefix}/CLEAR_COMPANY_INFO`,

}

const constants: Readonly<typeof actionTypeBase> = actionTypeBase;
export default constants;
