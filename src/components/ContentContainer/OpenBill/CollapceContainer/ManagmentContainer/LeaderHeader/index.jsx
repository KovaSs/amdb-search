import React from 'react'
import { getDate } from '../../../../../../services/momentDate'

/** Рендеринг header title физического лица */
const RenderLeaderNameHeader = props => {
  const { first_name, last_name, middle_name, position, ActualDate, id, inn, companyName, organisation, edited=false, editedInfo : RenderEditedLeader} = props

  const RenderLeaderInfo = () => {
    return (
      <>
        <label className={`leader-name-header_fio${ id==='leaders_list' ? "_history" : ''}`}>
          {`${last_name} ${first_name} ${middle_name}`}
        </label>
        <label className="leader-name-header_position">
          {`${inn}`}
        </label>
      </>
    )
  }

  return (
    <div className="leader-name-header">
      { edited ? <RenderEditedLeader /> : <RenderLeaderInfo /> }
      <label className="leader-name-header_position">
        {`${position}`}
      </label>
      <label className="leader-name-header_position">
        {`${organisation ? organisation : companyName}`}
      </label>
      <label className="leader-name-header_date">
        {`${getDate(ActualDate)}`}
      </label>
      { id==='leaders_list' && 
        <label className="leader-name-header_history">
          История
        </label>
      }
    </div>
  )
}

export default RenderLeaderNameHeader
