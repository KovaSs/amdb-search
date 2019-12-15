import { createSelector } from 'reselect'
import { moduleName } from './index'

/** Selectors */
const mainDataSelector = state => state[moduleName].get('mainData')
const searchRequestSelector = state => state[moduleName].get('searchRequest')
const searchDataSelector = state => state[moduleName].get('searchData')
const requestLoadingSelector = state => state[moduleName].get('requestLoading')
const errorsSelector = state => state[moduleName].get('errors')

export const ewsMainData = createSelector( mainDataSelector, (mainData) =>  mainData )
export const ewsErrors = createSelector( errorsSelector, (err) =>  err )
export const ewsSearchRequest = createSelector( searchRequestSelector, (searchRequest) =>  searchRequest )
export const ewsSearchData = createSelector( searchDataSelector, (searchData) =>  searchData )
export const ewsRequestLoading = createSelector( requestLoadingSelector, (requestLoading) => requestLoading )