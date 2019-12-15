import { createSelector } from 'reselect'
import { moduleName } from './index'


/** Selectors */
export const companyResSelector = state => state[moduleName].get('companyResponse')
export const requestLoadingSelector = state => state[moduleName].get('requestLoading').toJS()
export const renderDataSelector = state => state[moduleName].get('renderData')
export const innSelector = state => state[moduleName].get('inn')
export const errorsSelector = state => state[moduleName].get('errors').toJS()

export const decodedCompanyResponse = createSelector(
  companyResSelector, (companyResponse) =>  companyResponse
)

export const decodedInn = createSelector(
  innSelector, (inn) => inn
)

export const decodedErrors = createSelector(
  errorsSelector, (errors) => errors
)

export const decodedRenderData = createSelector(
  renderDataSelector, (renderData) => renderData
)

export const decodedMainCompanySource = createSelector(
  companyResSelector, (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, sanctions, isponlit_proizvodstva, ...companySource} = companyResponse
    return companySource
  }
)

export const decodedRiskSource = createSelector(
  companyResSelector, (companyResponse) => {
    const { arbiter, fns, sanctions, isponlit_proizvodstva } = companyResponse
    const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
    return riskSource
  }
)

export const decodedManagementSource = createSelector(
  companyResSelector, (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials } = companyResponse
    const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
    return managementSource
  }
)

export const decodedRequestLoading = createSelector(
  requestLoadingSelector, (requestLoading) => requestLoading
)