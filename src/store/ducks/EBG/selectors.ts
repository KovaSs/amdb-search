import { Map } from 'immutable'
import { createSelector } from 'reselect'
import { moduleName } from './index'
import { jsonUl } from '../../../services/fields'
import { trasform, cloCss } from "../../../services/utils"

/** Selectors */
export const storeRouter = state => state.router
export const storeRouterLocation = state => state.router.location.pathname
export const storeLoading = state => state[moduleName].get("requestLoading")

const companyResSelector = state => state[moduleName].get('companyResponse').toJS()
const mainObjectKeySelector = state => state[moduleName].get('mainObjectKey')
const companyUlResSelector = state => state[moduleName].get('companyResponseUl')
const companyImmutableResSelector = state => state[moduleName].get('companyResponse')
const ebgMainResponseSelector = state => state[moduleName].get('ebgMainResponse')
const ebgDataSelector = state => state[moduleName].get('ebgData')
const documentsSelector = state => state[moduleName].getIn(['companyResponse', 'documents'])
const headsSelector = state => state[moduleName].getIn(['companyResponse', 'heads'])
const foundersUlSelector = state => state[moduleName].getIn(['companyResponse', 'founders_ul'])
const digetsListSelector = state => state[moduleName].get('digestList')
const renderDataSelector = state => state[moduleName].get('renderData')
const fsspSelector = state => state[moduleName].get('fsspInfo')
const isIpSelector = state => state[moduleName].get('isIp')
const reqnumSelector = state => state[moduleName].get('reqnum')
const innSelector = state => state[moduleName].get('inn')
const nameCompanySelector = state => state[moduleName].getIn(['companyResponse', 'name'])
const сroinformResSelector = state => state[moduleName].get('croinformResponse')
const errorsSelector = state => state[moduleName].get('errors')
const companySrcSelector = state => state[moduleName].get('companyResponse')
const risksListSelector = state => state[moduleName].get('risksList')
const requestLoadingSelector = state => state[moduleName].get('requestLoading')
const risksSrcSelector = state => state[moduleName].get('risksSrc')
const mainDigetsSelector = state => state[moduleName].get('riskFactors')
const identifyInfoFlSelector = state => state[moduleName].get('identifyInfoFl')
const selectedInfoFlSelector = state => state[moduleName].get('selectedInfoFl')
const croinformInfoFlSelector = state => state[moduleName].get('croinformInfoFl')
const fsspInfoSelector = state => state[moduleName].get('fsspInfo')
const stopListsSelector = state => state[moduleName].get('stopLists')
const timeRequestSelector = state => state[moduleName].get('timeRequest')
const riskFactorsSelector = state => state[moduleName].get('riskFactors')
const companyUlSrcSelector = state => state[moduleName].get('companyResponseUl')
// With key props
const companyUlImmutableResSelector = (state, key) => state[moduleName].getIn(['companyResponseUl', key])
const nameUlSelector = (state, key) => state[moduleName].getIn(['companyResponseUl', key, 'name'], null)
const loadingFoundersUlSelector = (state, key) => state[moduleName].getIn(['requestLoading',"loadCompanyInfoUl", key], true)
const digetsListUlSelector = (state, key) => state[moduleName].getIn(['digestListUl', key], [])
const stopListSelector = (state, key) => state[moduleName].getIn(['stopLists', key], [])
const riskFactorsItemSelector = (state, keyId) => state[moduleName].getIn(['riskFactors', keyId], {digets: [], history: []})
const headItemKeySelector = (state, key) => key

export const storeTimeRequest = createSelector( timeRequestSelector, timeRequest =>  timeRequest )
export const storeIdentifyInfoFl = createSelector( identifyInfoFlSelector, identifyInfo =>  identifyInfo )
export const storeFsspInfo = createSelector( fsspInfoSelector, fsspInfo =>  fsspInfo )
export const storeStopLists = createSelector( stopListsSelector, stopLists =>  stopLists )
export const storeSelectedInfoFl = createSelector( selectedInfoFlSelector, selectedInfo =>  selectedInfo )
export const storeCroinformInfoFl = createSelector( croinformInfoFlSelector, croinformInfo =>  croinformInfo )
export const storeRiskFactors = createSelector( riskFactorsSelector, risks =>  risks )

export const decodedCompanyResponse = createSelector( companyResSelector, companyResponse =>  companyResponse )
export const ebgHeads = createSelector( headsSelector, heads =>  heads )
export const ebgFoundersUl = createSelector( foundersUlSelector, foundersUl =>  foundersUl )
export const decodedRisksList = createSelector( risksListSelector, risksList =>  risksList )
export const decodedEbgMainResponse = createSelector( ebgMainResponseSelector, ebgMainResponse =>  ebgMainResponse )
export const decodedEbgData = createSelector( ebgDataSelector, ebgData =>  ebgData )
export const decodedDocuments = createSelector( documentsSelector, documents =>  documents )
export const decodedFsspInfo = createSelector( fsspSelector, fssp =>  fssp )
export const decodedDigetsList = createSelector( digetsListSelector, digets =>  digets )
export const decodedisIp = createSelector( isIpSelector, isIp =>  isIp )
export const decodedСroinformResponse = createSelector( сroinformResSelector, сroinformRes =>  сroinformRes )
export const decodedCompanyName = createSelector( nameCompanySelector, companyName =>  companyName )
export const decodedReqnum = createSelector( reqnumSelector, reqnum => reqnum )
export const decodedInn = createSelector( innSelector, inn => inn )
export const decodedRenderData = createSelector( renderDataSelector, renderData => renderData )
export const decodedRequestLoading = createSelector( requestLoadingSelector, requestLoading => requestLoading )
export const decodedErrors = createSelector( errorsSelector, errors => errors )
export const storeRisksSrc = createSelector( risksSrcSelector, (risksSrc) =>  risksSrc )

// With key props
export const storeRiskFactorsItem = createSelector( riskFactorsItemSelector, riskItem =>  riskItem )
export const storeMainDigest = createSelector( mainDigetsSelector, riskFactors =>  trasform.getMainDigest(riskFactors) )
export const loadingFoundersUl = createSelector( loadingFoundersUlSelector, requestLoading => requestLoading !== undefined ? requestLoading : true )
export const nameFoundersUl = createSelector( nameUlSelector, name => name !== undefined ? name : null )
export const ebgCompanyResponseUl = createSelector( companyUlImmutableResSelector, companyResponse =>  companyResponse !== undefined ? companyResponse.toJS() : {} )
export const ebgDigetsListUl = createSelector( digetsListUlSelector, digets =>  digets !== undefined ? digets : [] )
export const ebgHeadItem = createSelector( headsSelector, headItemKeySelector, (heads, keyId) => heads.find(item => item.id === keyId) )
export const ebgCheckingItem = createSelector( ebgDataSelector, innSelector, (ebgData, inn) => ebgData.find(item => item.info.inn === inn) )

export const ebgHeadItemRiskFactors = createSelector( headsSelector, headItemKeySelector, (heads, keyId) => {
  const headItem = heads.find(item => item.id === keyId)
  if(headItem && headItem.risk_factors && headItem.risk_factors.history.length) {
    return headItem.risk_factors.history.length
  } else return 0
})

export const ebgMainCompanyRes = createSelector( companyUlResSelector, mainObjectKeySelector,
  (companyResponseUl, mainObjectKey) =>  mainObjectKey && companyResponseUl.filter((item, index) => index === mainObjectKey).get(mainObjectKey).toJS() )

export const ebgCompanyRes = createSelector( companyUlResSelector, headItemKeySelector,
  (companyResponseUl, objectKey) =>  companyResponseUl.has(objectKey) && companyResponseUl.get(objectKey).toJS() )

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

export const ebgMainSourceUl = createSelector(
  companyUlImmutableResSelector, companyResponse => {
    const  companySource = companyResponse !== undefined ? companyResponse.filterNot((value, key) => 
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
    ).toJS() : {}
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
  companyImmutableResSelector, stopListSelector, (companyResponse, stopLists) => {
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
    return trasform.riskSource({...riskSource, stop_list: stopLists})
  }
)

export const mainRiskSource = createSelector(
  companyImmutableResSelector, stopListsSelector, mainObjectKeySelector, (companyResponse, stopLists, mainKey) => {
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
    const mainSL = stopLists.get(mainKey)
    return trasform.riskSource({...riskSource, stop_list: mainSL})
  }
)

export const ebgRiskSource = createSelector(
  companyUlImmutableResSelector, stopListSelector, (companyResponse, stopLists) => {
    if(!companyResponse) return []
    const riskSource = companyResponse.filter((value, key) => 
      key === "arbiter" ||
      key === "fns" ||
      key === "sanctions" ||
      key === "isponlit_proizvodstva" ||
      key === "spiski" ||
      key === "spark_spiski" ||
      key === "arbiter_other"
    ).toJS()
    return trasform.riskSource({...riskSource, stop_list: stopLists})
  }
)

export const decodedManagementSource = createSelector(
  companyImmutableResSelector, companyResponse => {
    const managementSource = companyResponse.filter((value, key) => key === "heads").toJS()
    return trasform.getHeadsSrc(managementSource)
  }
)

export const storeUlSource = createSelector( companyUlSrcSelector, ulSrc => ulSrc)

export const storeEbgJsonInfo = createSelector( ebgMainResponseSelector, ebgSrc =>  {
  if(ebgSrc && ebgSrc.client.clientType === "COMPANY") {
    let JsonSrc = Map({...jsonUl})
    const blank = ebgSrc.client.blank
    for (const key in blank) {
      JsonSrc = JsonSrc.setIn(["blank", key, "data"], blank[key])
    }
    // const bankRequisites = ebgSrc.client.bankRequisites
    console.log('%cJsonSrc', cloCss.red, JsonSrc.toJS())
    console.log('%cEbgRes', cloCss.red, ebgSrc)
    return ebgSrc
  } else return ebgSrc
})