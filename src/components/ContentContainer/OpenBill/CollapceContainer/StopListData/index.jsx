import React from 'react'
import { Table, Row, Col, Collapse, Icon } from 'antd'
import { trasform } from "../../../../../services/transformData";

const StopListData = ({riskInfo, arbiter}) => {
  const { Panel } = Collapse;

    /** Стандартный функционал отслеживания активный панелей */
    const callback = key => {
    }

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
      if( item.data !== undefined && item.data !== "" && item.id !== "arbiter") {
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

export default StopListData
