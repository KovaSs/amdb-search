import React from 'react'
import { Tag, AutoComplete, Badge, Input } from 'antd'
import { getDate, uuid, parsingFio } from '../../../../../../services/utils'

/** Рендеринг компонента изменения LeaderHeader при редактировании записи */
const RenderEditedLeader = props => {
  const { Option } = AutoComplete;
  const { 
    user,
    userSelected,
    item: {position, ActualDate, organisation},
    companyName,
    onAction: {
      handleSelectOption,
      handleChangeInn,
      handleChangeSurName,
      handleChangeMiddleName,
      handleChangeFirstName
    }
  } = props

  const renderPositionTag = () => {
    if(Array.isArray(position)) return position.map(item => {
      if(item !== "") return <Tag key={uuid()} color="blue" >{item}</Tag>
      else return null
    })
    return <Tag color="blue" >{position}</Tag>
  }

  // Рендеринг опций выпадающего меню
  const renderFioOption = item =>  <Option key={item} text="SurName" title={item} value={parsingFio(item).SurName}> {item} </Option>
  const renderInnOption = item =>  <Option key={`header-list-inn-${item}`} text="inn" title={item} value={item}> {item} </Option>

  return (
    <div className="leader-name-header">
      <span onClick={e => e.stopPropagation()} style={{marginRight: 10}}>
        <span className="leader-name-header_fio" >
          <Badge count={user.fio.length ? user.fio.length : null }>
            <AutoComplete
              size="small"
              key="last_name"
              style={{ width: 150 }}
              optionLabelProp={""}
              dataSource={user.fio.map(renderFioOption)}
              onSelect={handleSelectOption}
              onChange={handleChangeSurName}
              value={userSelected.SurName}
              placeholder="Фамилия"
              filterOption={(value, option) =>  option.props.title.toUpperCase().indexOf(value.toUpperCase()) !== -1}
              allowClear
            />
          </Badge>
          <Input 
            size="small"
            placeholder="Имя" 
            style={{ width: 150 }}
            value={userSelected.FirstName} 
            onChange={handleChangeFirstName} 
          />
          <Input 
            size="small"
            placeholder="Отчество" 
            style={{ width: 150 }} 
            value={userSelected.MiddleName} 
            onChange={handleChangeMiddleName} 
          />
        </span>
        <span className="leader-name-header_position">
          <Badge count={user.inn.length ? user.inn.length : null }>
            <AutoComplete
              size="small"
              key="header-list-inn"
              optionLabelProp={""}
              style={{ width: 150 }}
              value={userSelected.inn}
              dataSource={user.inn.map(renderInnOption)}
              onSelect={handleSelectOption}
              onChange={handleChangeInn}
              placeholder="ИНН"
              filterOption={(value, option) =>  option.props.title.toUpperCase().indexOf(value.toUpperCase()) !== -1}
              allowClear
            />
          </Badge>
        </span>
      </span>
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

export default RenderEditedLeader