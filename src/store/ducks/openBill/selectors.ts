import { createSelector } from 'reselect'
import { trasform } from "../../../services/utils"
import { moduleName } from './index'


/** Selectors */
export const storeInn = state => state[moduleName].getIn(['companyResponse', 'inn'])
export const storeKey = state => state[moduleName].getIn(['companyResponse', 'key'])
export const storeDoc = state => state[moduleName].getIn(['companyResponse','documents'])
export const storeHistoryIdentify = state => state[moduleName].getIn(['companyResponse', 'historyIdentify'])
export const storeLoading = state => state[moduleName].getIn(["requestLoading", "getRiskFactorsFl"])

const storeStateSelector = state => state[moduleName]
const companyResSelector = state => state[moduleName].get('companyResponse').toJS()
const companyImmutableResSelector = state => state[moduleName].get('companyResponse')
const documentsSelector = state => state[moduleName].getIn(['companyResponse', 'documents'])
const digetsListSelector = state => state[moduleName].get('digestList')
const risksSrcSelector = state => state[moduleName].get('risksSrc')
const renderDataSelector = state => state[moduleName].get('renderData')
const fsspSelector = state => state[moduleName].get('fsspInfo')
const isIpSelector = state => state[moduleName].get('isIp')
const reqnumSelector = state => state[moduleName].get('reqnum')
const innSelector = state => state[moduleName].get('inn')
const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
const сroinformResSelector = state => state[moduleName].get('croinformResponse')
const requestLoadingSelector = state => state[moduleName].get('requestLoading')
const errorsSelector = state => state[moduleName].get('errors')
const companySrcSelector = state => state[moduleName].get('companyResponse')
const risksListSelector = state => state[moduleName].get('risksList')
const mainDigetsSelector = state => state[moduleName].get('riskFactors')
const riskFactorsSelector = state => state[moduleName].get('riskFactors')
const storeHeadsSelector = state => state[moduleName].getIn(['companyResponse', 'heads'])
const identifyInfoFlSelector = state => state[moduleName].get('identifyInfoFl')
const selectedInfoFlSelector = state => state[moduleName].get('selectedInfoFl')
const croinformInfoFlSelector = state => state[moduleName].get('croinformInfoFl')
const fsspInfoSelector = state => state[moduleName].get('fsspInfo')
const stopListsSelector = state => state[moduleName].get('stopLists')
const timeRequestSelector = state => state[moduleName].get('timeRequest')
const riskFactorsItemSelector = (state, keyId) => state[moduleName].getIn(['riskFactors', keyId], {digets: [], history: []})
const keySelector = (state, key) => key

export const storeTimeRequest = createSelector( timeRequestSelector, timeRequest =>  timeRequest )
export const storeIdentifyInfoFl = createSelector( identifyInfoFlSelector, identifyInfo =>  identifyInfo )
export const storeFsspInfo = createSelector( fsspInfoSelector, fsspInfo =>  fsspInfo )
export const storeStopLists = createSelector( stopListsSelector, stopLists =>  stopLists )
export const storeSelectedInfoFl = createSelector( selectedInfoFlSelector, selectedInfo =>  selectedInfo )
export const storeCroinformInfoFl = createSelector( croinformInfoFlSelector, croinformInfo =>  croinformInfo )
export const storeRisksSrc = createSelector( risksSrcSelector, risksSrc =>  risksSrc )
export const storeRiskFactors = createSelector( riskFactorsSelector, risks =>  risks )

export const ebgHeads = createSelector( storeHeadsSelector, heads =>  heads )
export const decodedCompanyResponse = createSelector( companyResSelector, companyResponse =>  companyResponse )
export const storeRiskFactorsItem = createSelector( riskFactorsItemSelector, riskItem =>  riskItem )
export const decodedRisksList = createSelector( risksListSelector, risksList =>  risksList )
export const decodedDocuments = createSelector( documentsSelector, documents =>  documents )
export const decodedFsspInfo = createSelector( fsspSelector, fssp =>  fssp )
export const decodedDigetsList = createSelector( digetsListSelector, digets =>  digets )
export const decodedisIp = createSelector( isIpSelector, isIp =>  isIp )
export const decodedСroinformResponse = createSelector( сroinformResSelector, сroinformRes =>  сroinformRes )
export const decodedCompanyName = createSelector( nameCompanySelector, companyName =>  companyName )
export const decodedReqnum = createSelector( reqnumSelector, reqnum => reqnum )
export const decodedInn = createSelector( innSelector, inn => inn )
export const decodedErrors = createSelector( errorsSelector, errors => errors )
export const decodedRenderData = createSelector( renderDataSelector, renderData => renderData )
export const decodedRequestLoading = createSelector( requestLoadingSelector, requestLoading => requestLoading )

export const storeMainDigest = createSelector( mainDigetsSelector, riskFactors =>  trasform.getMainDigest(riskFactors) )
export const storeHeadItem = createSelector(storeHeadsSelector, keySelector, (heads, keyId) => heads.find((value, key) => value === keyId))

export const decodedMainCompanySource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const  companySource = companyResponse.filterNot((value, key) => 
      key === "heads" ||
      key === "management_companies" ||
      key === "founders_fl" ||
      key === "founders_ul" ||
      key === "befenicials" ||
      key === "arbiter" ||
      key === "fns" ||
      key === "inn" ||
      key === "ogrn" ||
      key === "name" ||
      key === "full_name" ||
      key === "sanctions" ||
      key === "fl" ||
      key === "ul" ||
      key === "heads_ul" ||
      key === "heads_fl" ||
      key === "share_holders_fl" ||
      key === "share_holders_ul" ||
      key === "leaders_list" ||
      key === "stop_list" ||
      key === "spiski" ||
      key === "spark_spiski" ||
      key === "arbiter_other" ||
      key === "birthdate" ||
      key === "birth_place" ||
      key === "sex" ||
      key === "isponlit_proizvodstva"
    ).toJS()
    return trasform.companySource(companySource)
  }
)
export const decodedCompanySrc = createSelector(
  companySrcSelector, companyResponse => {
    const companySrc = companyResponse.filter((value, key) => 
    key === "inn" ||
    key === "ogrn" ||
    key === "name" ||
    key === "full_name"
  ).toJS()
    return companySrc
  }
)

export const digetsSrc = createSelector(
  companySrcSelector, companyResponse => {
    const companySrc = companyResponse.filter((value, key) => 
    key === "inn" ||
    key === "ogrn" ||
    key === "name" ||
    key === "heads" ||
    key === "full_name"
  ).toJS()
    return companySrc
  }
)
export const decodedRiskSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const riskSource = companyResponse.filter((value, key) => 
    key === "arbiter" ||
    key === "fns" ||
    key === "sanctions" ||
    key === "isponlit_proizvodstva" ||
    key === "spiski" ||
    key === "spark_spiski" ||
    key === "arbiter_other" ||
    key === "stop_list"
  ).toJS()
    return trasform.riskSource(riskSource)
  }
)
export const decodedManagementSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const managementSource = companyResponse.filter((value, key) => key === "heads").toJS()
    return trasform.getHeadsSrc(managementSource)
  }
)