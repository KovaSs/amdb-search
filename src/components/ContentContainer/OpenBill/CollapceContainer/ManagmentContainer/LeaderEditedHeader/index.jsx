import React from 'react'
import { Tag, AutoComplete, Badge, Input, Popover } from 'antd'
import { getDate, uuid, parsingFio } from '../../../../../../services/utils'

const styleCss = {
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto"
  },
  bange: {
    cyan: {
      backgroundColor: "#e6fffb",
      color: "#13c2c2",
      boxShadow: "0 0 0 1px #87e8de inset"
    },
    volcano: {
      backgroundColor: "#fff2e8",
      color: "#fa541c",
      boxShadow: "0 0 0 1px #ffbb96 inset"
    }
  }
}

/** Рендеринг компонента изменения LeaderHeader при редактировании записи */
const RenderEditedLeader = props => {
  const { Option } = AutoComplete;
  const { 
    user,
    userSelected,
    identifyUserloading,
    croinformRes,
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

  const renderStopListInfo = (arr =[]) => {
    if(!croinformRes) return 
    const vector = croinformRes.vector ? croinformRes.vector : []
    const lists = croinformRes.lists ? croinformRes.lists : []
    // const lists = croinformRes.lists ? croinformRes.lists : []
    if(vector.length) {
      const content = <div style={styleCss.popover}>{vector.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="vector" title="Найден в списках" content={content} trigger="hover">
          <Badge count={vector.length} offset={[-9,1]} style={styleCss.bange.cyan}>
            <Tag color="cyan" > Вектор заемщика </Tag> 
          </Badge>
        </Popover>
      )
    }
    if(lists.length) {
      const content = <div style={styleCss.popover}>{lists.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="lists" title="Найден в списках" content={content} trigger="hover">
          <Badge count={lists.length} offset={[-9,1]} style={styleCss.bange.volcano}>
            <Tag color="volcano" > Списки </Tag> 
          </Badge>
        </Popover>
      )
    }
    return arr
  }

  return (
    <div className="leader-name-header">
      <span onClick={e => e.stopPropagation()} style={{marginRight: 10}}>
          <span className="leader-name-header_fio" >
            <Badge count={user.fio.length > 1 ? user.fio.length : null }>
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
                disabled={identifyUserloading}
              />
            </Badge>
            <Input 
              size="small"
              placeholder="Имя" 
              style={{ width: 150 }}
              value={userSelected.FirstName} 
              onChange={handleChangeFirstName}
              disabled={identifyUserloading} 
            />
            <Input 
              size="small"
              placeholder="Отчество" 
              style={{ width: 150 }} 
              value={userSelected.MiddleName} 
              onChange={handleChangeMiddleName}
              disabled={identifyUserloading} 
            />
          </span>
          <span className="leader-name-header_position">
            <Badge count={user.inn.length > 1 ? user.inn.length : null }>
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
                disabled={identifyUserloading}
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
      <label className="leader-name-header_date" onClick={e => e.stopPropagation(e)}>
        { renderStopListInfo() }
      </label>
    </div>
  )
}

export default RenderEditedLeader