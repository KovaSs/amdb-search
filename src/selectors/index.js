import { createSelector } from 'reselect'

export const companyResSelector = (state, moduleName) => state[moduleName].companyResponse
export const requestLoadingSelector = (state, moduleName) => state[moduleName].requestLoading
export const renderDataSelector = (state, moduleName) => state[moduleName].renderData
export const innSelector = (state, moduleName) => state[moduleName].inn
export const errorsSelector = (state, moduleName) => state[moduleName].errors

export const decodedCompanyResponse = createSelector(
  companyResSelector,
  (companyResponse) => {
    return companyResponse
  }
)

export const decodedInn = createSelector(
  innSelector,
  (inn) => inn
)

export const decodedErrors = createSelector(
  errorsSelector,
  (errors) => errors
)

export const decodedRenderData = createSelector(
  renderDataSelector,
  (renderData) => renderData
)

export const decodedMainCompanySource = createSelector(
  companyResSelector,
  (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, sanctions, isponlit_proizvodstva, ...companySource} = companyResponse
    return companySource
  }
)

export const decodedRiskSource = createSelector(
  companyResSelector,
  (companyResponse) => {
    const { arbiter, fns, sanctions, isponlit_proizvodstva } = companyResponse
    const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
    return riskSource
  }
)

export const decodedManagementSource = createSelector(
  companyResSelector,
  (companyResponse) => {
    const { heads, management_companies, founders_fl, founders_ul, befenicials } = companyResponse
    const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
    return managementSource
  }
)

export const decodedRequestLoading = createSelector(
  requestLoadingSelector,
  (requestLoading) => requestLoading
)
