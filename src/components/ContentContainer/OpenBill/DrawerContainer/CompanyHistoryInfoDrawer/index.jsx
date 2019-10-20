import React from 'react';
import { Drawer, Collapse, Icon, PageHeader, Button } from "antd";
import toggleDrawer from '../index'
import { getDate } from '../../../../../services/utils'
import './drawer-history.scss'

const CompanyHistoryInfoDrawer = props => {
  const {onClose, visible, headHistory, addUser, heads} = props
  const { Panel } = Collapse;

  if(!headHistory) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill -> CompanyHistoryInfoDrawer", пожалуйста перезагрузите страницу</div>

  const _renderHeadsHistory = () => {
    return (
      <Panel header="Руководители" key="1" showArrow={false}>
        {_renderManagment()}
      </Panel>
    )
  }

  const _renderManagment = searchData => {

    const RenderLeaderNameHeader = props => {
      const { first_name, last_name, middle_name, ActualDate, id } = props
      return (
        <div className="leader-name-header">
          <label className={`leader-name-header_fio${ id==='leaders_list' ? "_history" : ''}`}>{`${last_name} ${first_name} ${middle_name}`}</label>
          <label className="leader-name-header_date">{`${getDate(ActualDate)}`}</label>
        </div>
      )
    }

    const _fouldersFl = (item, key, id) => {
      const { inn, position } = item
      return (
        <Panel 
          key={String(key)}
          header={ <RenderLeaderNameHeader {...item} id={id}/> } 
          extra={<BtnExtra user={item}/>}
        >
          <div>{`ИНН: ${inn}`}</div>
          <div>{`Должность: ${position[0].tagName}`}</div>
        </Panel>
      )
    } 

    const _fouldersUl = ( item, key ) => {
      const { full_name, name, inn } = item
      return (
        <Panel 
          key={String(key)}
          header={name}
          extra={<BtnExtra user={item}/>}
        >
          <div>{`Название: ${full_name || name}`}</div>
          <div>{`ИНН: ${inn}`}</div>
        </Panel>
      )
    }

    const BtnExtra = ({user}) => {
      const showBtn = heads[0].data.filter(head => head.fio === user.fio).length
      const identifyUserInfo = e => {
        e.stopPropagation()
        addUser({...user, history: true})
      }
      return <Button 
        title={showBtn ? "Добален в проверку" : "Добавить на проверку"}
        icon="user-add"
        className='heads-search-btn'
        style={{
          color: showBtn ? "gray" : "rgba(14, 117, 253, 0.992)",
          cursor: showBtn ? "not-allowed" : "pointer"
        }}
        onClick={ e => identifyUserInfo(e) }
        disabled={showBtn}
      />
    }
    
    
    const historyHeads =  headHistory.map( (item, key) => {
      return (
        <Collapse 
          key={`${item.inn}-${key}`}
          className="managment"
          bordered={false}
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
        >
          { item.name && _fouldersUl(item, key) }
          { item.middle_name && _fouldersFl(item, key, searchData) }
        </Collapse> 
      )
    })
    return historyHeads
  }

  return (
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <PageHeader
          title="Исторические данные о кампании"
        >
          <Collapse 
            defaultActiveKey={['1', '2', '3', '4']} 
            expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
          >
            {_renderHeadsHistory()}
          </Collapse>
        </PageHeader>
      </Drawer>
  );
}

export default toggleDrawer(CompanyHistoryInfoDrawer)