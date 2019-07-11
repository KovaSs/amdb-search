import React from 'react'
import { Table,  Descriptions, Collapse, Icon, Spin } from 'antd'
import { trasform } from "../../../../../services/utils";

const StopListData = ({riskInfo, arbiter, loading =false}) => {
  const { Panel } = Collapse;

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  /** Табилица арбитраж */
  const RenderAbiterTable = () => {
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
        className="arbiter-risk-info"
      />
    )
  }

  const renderDescriptionFields = riskInfo.map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    if ( item.data !== undefined && item.data !== "" && item.id !== "arbiter" && !Array.isArray(item.data)) {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <span style={{color: item.id === "spark_spiski" ? "" : "red"}}>{ item.data }</span>
        </DescriptionsItem>
      )
    } else if(item.id === "arbiter" && item.data !== "") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <RenderAbiterTable />
        </DescriptionsItem>
      )
    } else if (Array.isArray(item.data)) {
      const itemArray = item.data.map((el, key) => <span key={key} style={{color: item.id === "spark_spiski" ? "" : "red"}}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={2}>
          { itemArray }
        </DescriptionsItem>
      )
    }else {
      return null
    }
  })

  return (
    <Collapse 
      defaultActiveKey={['1', '2']} Раскоментировать при реализации стоп-листов
      onChange={callback}
      expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
      style={{marginTop: "5px"}}
    >
      <Panel header="Стоп-листы / Cписки" key="1" showArrow={false}>
        <Spin spinning={loading}>
          <Descriptions size="small" bordered border column={{md:3, sm:2, xs:1}}>
            {renderDescriptionFields}
          </Descriptions>
        </Spin>
      </Panel>
    </Collapse> 
  )
}

export default StopListData
