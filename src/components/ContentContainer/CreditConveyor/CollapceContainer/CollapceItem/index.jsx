import React from 'react'
import { Collapse, Col, Row, Icon, Table, Descriptions } from 'antd';
import { trasform } from "../../../../../services/transformData";

const CollapceItem = props => {
  const { Panel } = Collapse;
  const { companySource, riskSource,  managementSource} = props

  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  const managementInfo = trasform._managementSource(managementSource)
  const riskInfo = trasform._riskSource(riskSource)

  console.log('managementInfo', managementInfo)

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
              {`${item.data}` }
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
    const heads = managementInfo.find( item => item.id === `${searchData}`)
    return heads.data.map( (item, key) => {
      const { first_name, last_name, middle_name, full_name, name, inn } = item
      const btnExtra = () => (
        <Icon title="История" className='heads-search-btn' type="file-search" onClick={ e => e.stopPropagation() }/>
      )
      return (
        <Collapse 
          key={inn}
          className="managment"
          defaultActiveKey={['0', '1', '2', '3', '4']} 
          onChange={callback}
          bordered={false}
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
        >
          <Panel 
            key={String(key)}
            header={searchData === "founders_ul" ? `${name}` : `${last_name} ${middle_name}  ${first_name}`} 
            extra={btnExtra()}
          >
            <div>{searchData === "founders_ul" ? `Название: ${full_name || name}` : `ФИО: ${last_name} ${middle_name}  ${first_name}`}</div>
            <div>{`ИНН: ${inn}`}</div>
          </Panel>
        </Collapse> 
      )
    })
  }

  return (
    <>
      { companySource ?
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
          onChange={callback}
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
        >
          <Panel header="Общая информация" key="1" showArrow={false}>
            <Row>
              <Col span={24}>
                <Descriptions bordered border size="small" column>
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
          <Panel header="Бенефициалы" key="4" forceRender className="table-info-panel">
            <div>Информация о бенифициалах</div>
          </Panel>
        </Collapse>: null
      }
    </>
  )
}

export { CollapceItem }
