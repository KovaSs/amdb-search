import React from 'react'
import { Collapse, Col, Row, Icon, Table, Descriptions, Divider } from 'antd';
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
      const red = (item.id === "fns" || item.id === "sanctions" || item.id === "isponlit_proizvodstva") ? " red" : ''
      if( item.data !== "" && item.id !== "arbiter") {
        return (
          <Row key={item.id}>
            <Divider orientation="left">{ item.title }</Divider>
            <Col span={24} className={'descr' + red}>{`${item.data}` }</Col>
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
            <Panel header="Арбитраж" key="1" showArrow={false}>
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
            <Panel header="Стоп-листы" key="2" forceRender showArrow={false}>
            { renderAbiterTable() }
            </Panel>
          </Collapse> 
        </Col>
      </>
    )
  }
  
  const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

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

  return (
    <>
      { companySource ?
        <Collapse 
          defaultActiveKey={['1', '2']} 
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
          { managementSource ?
              <Panel header="Связанные лица" key="2" forceRender className="table-info-panel">
              <Collapse onChange={callback} expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}>
                <Panel header="Руководители" key="1" forceRender>
                  <div>{text}</div>
                </Panel>
                <Panel header="Состав собственников" key="2" forceRender>
                  <div>{text}</div>
                </Panel>
              </Collapse>
            </Panel> : null
          }
        </Collapse>: null
      }
    </>
  )
}

export { CollapceItem }
