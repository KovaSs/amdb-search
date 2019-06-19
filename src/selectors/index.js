import { createSelector } from 'reselect'

export const articleSelector = state => state.articles

export const filtratedArtcles = createSelector(
  articleSelector,
  (articles) => {
    return // converted data
  }
)
