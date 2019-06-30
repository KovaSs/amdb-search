import React from 'react'
import { Table,  Descriptions, Collapse, Icon } from 'antd'
import { trasform } from "../../../../../services/transformData";

const StopListData = ({riskInfo, arbiter}) => {
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
      />
    )
  }

  const renderDescriptionFields = riskInfo.map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    if ( item.data !== undefined && item.data !== "" && item.id !== "arbiter" && !Array.isArray(item.data)) {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={2}>{ item.data }</DescriptionsItem>
      )
    } else if(item.id === "arbiter") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <RenderAbiterTable />
        </DescriptionsItem>
      )
    } else if (Array.isArray(item.data)) {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
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
      defaultActiveKey={['1', '2']} 
      onChange={callback}
      expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
      style={{marginTop: "5px"}}
    >
      <Panel header="Стоп-листы" key="1" showArrow={false}>
        <Descriptions border size="small" bordered column={{xxl:4, xl:4, lg: 4, md:4, sm:2, xs:1}}>
          {renderDescriptionFields}
        </Descriptions>
      </Panel>
    </Collapse> 
  )
}

export default StopListData
