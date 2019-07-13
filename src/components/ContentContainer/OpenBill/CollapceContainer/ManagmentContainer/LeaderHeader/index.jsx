import React from 'react'
import { Tag } from 'antd'
import { getDate, uuid } from '../../../../../../services/utils'



/** Рендеринг header title физического лица */
const LeaderHeader = props => {
  const { 
    item: {first_name, last_name, middle_name, position, ActualDate, inn, organisation}, 
    companyName, 
    userSelected : {FirstName, MiddleName, SurName, inn: INN }
  } = props

  const renderPositionTag = () => {
    if(Array.isArray(position)) return position.map(item => {
      if(item !== "") return <Tag key={uuid()} color="blue" >{item}</Tag>
      else return null
    })
    return <Tag color="blue" >{position}</Tag>
  }

  return (
    <div className="leader-name-header">
      <label className="leader-name-header_fio">
        {`${SurName ? SurName : last_name} ${FirstName ? FirstName : first_name} ${MiddleName ? MiddleName : middle_name}`}
      </label>
      <label className="leader-name-header_position">
        {INN ? INN : inn}
      </label>
      <label className="leader-name-header_position">
        { renderPositionTag() }
      </label>
      <label className="leader-name-header_position">
        {`${organisation ? organisation.name : companyName}`}
      </label>
      <label className="leader-name-header_date">
        { getDate(ActualDate) }
      </label>
    </div>
  )
}

export default LeaderHeader