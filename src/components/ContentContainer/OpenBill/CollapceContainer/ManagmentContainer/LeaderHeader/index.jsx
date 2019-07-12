import React from 'react'
import { Tag } from 'antd'
import { getDate, uuid } from '../../../../../../services/utils'

/** Рендеринг header title физического лица */
const LeaderHeader = props => {
  const { first_name, last_name, middle_name, position, ActualDate, id, inn, companyName, organisation, edited=false, editedInfo : RenderEditedLeader} = props

  const renderPositionTag = () => {
    if(Array.isArray(position)) return position.map(item => {
      if(item !== "") return <Tag key={uuid()} color="blue" >{item}</Tag>
      else return null
    })
    return <Tag color="blue" >{position}</Tag>
  }

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
        {
          renderPositionTag()
        }
      </label>
      <label className="leader-name-header_position">
        {`${organisation ? organisation.name : companyName}`}
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

export default LeaderHeader
