import React from 'react';
// import { dropRight } from 'lodash';
import { Collapse, Col, Row, Icon, Table, Descriptions } from 'antd';
import { trasform } from "../../../../../services/transformData";

const CollapceItem = props => {
  const { Panel } = Collapse;
  const { companySource, riskSource,  managementSource} = props

  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  const managementInfo = trasform._managementSource(managementSource)
  const riskInfo = trasform._riskSource(riskSource)

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  /** Рендеринг данных по стоплистам */
  const renderStopListsInfo = () => {
    const { arbiter } = riskSource
    /** Табилица арбитраж */
    const renderAbiterTable = () => {
      const arbiterData = trasform._arbiterTransform(arbiter)
      const columns = [
        { title: 'Роль', dataIndex: 'name'},
        { title: 'За 12 месяцев', dataIndex: 'year' }, 
        { title: 'За 3 года', dataIndex: 'year3' }
      ];
      return (
        <Table
          columns={columns}
          dataSource={arbiterData}
          bordered
          pagination={false}
        />
      )
    }

    const renderStopListFields = riskInfo.map(item => {
      if( item.data !== "" && item.id !== "arbiter") {
        return (
          <Row key={item.id} className="stop-list">
            <div className="label">{ item.title }</div>
              { Array.isArray(item.data) ?
                item.data.map((item, key) => <span key={key}>{ item }<br/></span>) :
                `${item.data}`
              }
          </Row>
        )
      } else {
        return null
      }
    })

    return (
      <>
        <Col span={18}>
          <Collapse 
            defaultActiveKey={['1', '2']} 
            onChange={callback}
            expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
            style={{marginTop: "5px"}}
          >
            <Panel header="Стоп-листы" key="1" showArrow={false}>
              { renderStopListFields }
            </Panel>
          </Collapse> 
        </Col>
        <Col span={6}>
          <Collapse 
            defaultActiveKey={['1', '2']} 
            onChange={callback}
            expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
            style={{marginTop: "5px"}}
          >
            <Panel header="Арбитраж" key="2" forceRender showArrow={false}>
              { renderAbiterTable() }
            </Panel>
          </Collapse> 
        </Col>
      </>
    )
  }

  /** Рендеринг информационных полей об организации */
  const renderCompanySourceDescriptionFields = fullOrganistionInfo.filter(item => {
    return item.data && 
      item.id !== "arbiter" && 
      item.id !== "befenicials" && 
      item.id !== "founders_fl" && 
      item.id !== "founders_ul" && 
      item.id !== "heads"  && 
      item.id !== "management_companies" && 
      item.id !== "name"  && 
      item.id !== "fns"  && 
      item.id !== "sanctions"  && 
      item.id !== "inn"  && 
      item.id !== "ogrn"  && 
      item.id !== "isponlit_proizvodstva"  && 
      item.id !== "full_name"
  }).map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    return <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>{ item.data }</DescriptionsItem>
  })

  /** Вывод данных об руководстве */
  const renderManagment = searchData => {
    const activePanel = [];
    const heads = managementInfo.find( item => item.id === `${searchData}`);

    const _fouldersFl = ( item, key ) => {
      const { first_name, last_name, middle_name, inn } = item
      return (
        <Panel 
          key={String(key)}
          header={ `${last_name} ${first_name} ${middle_name}` } 
          extra={btnExtra()}
        >
          <div>{`ФИО: ${last_name} ${first_name} ${middle_name}`}</div>
          <div>{`ИНН: ${inn}`}</div>
        </Panel>
      )
    } 

    const _fouldersUl = ( item, key ) => {
      const { full_name, name, inn } = item
      return (
        <Panel 
          key={String(key)}
          header={ `${name}` } 
          extra={btnExtra()}
        >
          <div>{`Название: ${full_name || name}`}</div>
          <div>{`ИНН: ${inn}`}</div>
        </Panel>
      )
    } 

    const btnExtra = () => (
      <Icon title="История" className='heads-search-btn' type="file-search" onClick={ e => e.stopPropagation() }/>
    )
    
    return heads.data.map( (item, key) => {
      activePanel.push(String(key))
      const { inn } = item
      if( searchData === 'founders_fl' && managementInfo.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn) ) {
        activePanel.pop()
      } else if(searchData === 'befenicials' 
        && managementInfo.find( item => item.id === `founders_fl`).data.find( el =>  el.inn === item.inn)
        && managementInfo.find( item => item.id === `heads`).data.find( el =>  el.inn === item.inn)) {
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
          { item.name && _fouldersUl(item, key) }
          { item.middle_name && _fouldersFl(item, key) }
        </Collapse> 
      )
    })
  }

  return (
    <>
      { companySource &&
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
          onChange={callback}
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
        >
          <Panel header="Общая информация" key="1" showArrow={false}>
            <Row>
              <Col span={24}>
                <Descriptions bordered border size="small" span={2} column={{xxl:3, xl:3, lg: 3, md:3, sm:2, xs:1}}>
                  { renderCompanySourceDescriptionFields }
                </Descriptions>
                { renderStopListsInfo() }
              </Col>
            </Row>
          </Panel>
          <Panel header="Руководители" key="2" forceRender className="table-info-panel">
            {renderManagment('heads')}
          </Panel>
          <Panel header="Состав собственников" key="3" forceRender className="table-info-panel">
            {renderManagment('founders_fl')}
            {renderManagment('founders_ul')}
          </Panel>
          <Panel header="Бенефициары" key="4" forceRender className="table-info-panel">
            {renderManagment('befenicials')}
          </Panel>
        </Collapse>
      }
    </>
  )
}

export { CollapceItem }
