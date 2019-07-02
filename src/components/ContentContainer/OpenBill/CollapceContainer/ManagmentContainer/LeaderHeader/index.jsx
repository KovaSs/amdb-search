import React from 'react'
import moment from 'moment'

/** Рендеринг header title физического лица */
const RenderLeaderNameHeader = props => {
  const { first_name, last_name, middle_name, position, ActualDate, id } = props
  return (
    <div className="leader-name-header">
      <label className={`leader-name-header_fio${ id==='leaders_list' ? "_history" : ''}`}>{`${last_name} ${first_name} ${middle_name}`}</label>
      <label className="leader-name-header_position">{`${position}`}</label>
      <label className="leader-name-header_date">{`${moment(ActualDate).format('DD.MM.YYYY')}`}</label>
      { id==='leaders_list' && <label className="leader-name-header_history">История</label> }
    </div>
  )
}

export default RenderLeaderNameHeader
