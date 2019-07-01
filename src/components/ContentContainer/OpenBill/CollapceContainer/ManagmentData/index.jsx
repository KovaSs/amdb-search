import React from 'react'
import moment from 'moment'
import { Collapse, Icon } from 'antd';

  /** Вывод данных об руководстве */
const ManagmentData = ({searchData, dataFields, identifyUser}) => {
  const activePanel = [];
  const { Panel } = Collapse;
  const heads = dataFields.find( item => item.id === `${searchData}`);

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

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  const renderFouldersFl = (item, key, id) => {
    const { first_name, last_name, middle_name, inn, position} = item
    return (
      <Panel 
        key={String(key)}
        header={ <RenderLeaderNameHeader {...item} id={id}/> } 
        extra={<BtnExtra user={item}/>}
      >
        <div>{`ФИО: ${last_name} ${first_name} ${middle_name}`}</div>
        <div>{`ИНН: ${inn}`}</div>
        <div>{`Должность: ${position}`}</div>
      </Panel>
    )
  } 

  const renderFouldersUl = ( item, key ) => {
    const { full_name, name, inn } = item
    return (
      <Panel 
        key={String(key)}
        header={ `${name}` } 
        extra={<BtnExtra user={item}/>}
      >
        <div>{`Название: ${full_name || name}`}</div>
        <div>{`ИНН: ${inn}`}</div>
      </Panel>
    )
  }

  const BtnExtra = ({user}) => {
    const identifyUserInfo = e => {
      e.stopPropagation()
      identifyUser(user)
    }
    return <Icon title="История" className='heads-search-btn' type="file-search" onClick={ (e) => identifyUserInfo(e) }/>
  }
  
  
  return heads.data.map( (item, key) => {
    activePanel.push(String(key))
    const { inn } = item
    if( searchData === 'founders_fl' && dataFields.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn) ) {
      activePanel.pop()
    } else if(searchData === 'befenicials' 
      && dataFields.find( item => item.id === `founders_fl`).data.find( el =>  el.inn === item.inn)
      && dataFields.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn)) {
      activePanel.pop()
    } else if(searchData === 'leaders_list'){
      activePanel.pop()
    }
    return (
      <Collapse 
        key={inn}
        className="managment"
        defaultActiveKey={activePanel} 
        onChange={callback}
        bordered={false}
        expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
      >
        { item.name && renderFouldersUl(item, key) }
        { item.middle_name && renderFouldersFl(item, key, searchData) }
      </Collapse> 
    )
  })
}

export default ManagmentData
