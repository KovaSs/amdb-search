import { createSelector } from 'reselect'
import { moduleName } from './index'

/** Selectors */
const mainDataSelector = state => state[moduleName].get('mainData')
const requestLoadingSelector = state => state[moduleName].get('requestLoading')

export const ewsMainData = createSelector( mainDataSelector, (mainData) =>  mainData )
export const ewsRequestLoading = createSelector( requestLoadingSelector, (requestLoading) => requestLoading )