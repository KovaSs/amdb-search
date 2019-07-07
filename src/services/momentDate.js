import moment from 'moment'

export const getDate = data => {
  return moment(data).format('DD.MM.YYYY')
}