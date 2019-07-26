import React from 'react'
import { Table,  Descriptions, Collapse, Icon, Spin, Row, Col } from 'antd'
import { trasform, uuid } from "../../../../../services/utils";

const styleCss = {
  autoScroll : {
    maxHeight: 102,
    minWidth: 300,
    overflowY: "auto"
  },
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    },
    rowTitle: {
      fontWeight: 600,
      color: "red",
      marginTop: 5
    },
    text: {
      color: "red"
    },
    rowKey: {
      fontWeight: 600,
      marginTop: 5
    }
  },
}

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
      <Row>
        <Col span={arbiter.other ? 12 : 24}>
          <Table
            columns={columns}
            dataSource={arbiterData}
            bordered
            pagination={false}
            className="arbiter-risk-info"
          />
        </Col>
      </Row>
    )
  }

  const renderDescriptionFields = riskInfo.map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    if ( item.data !== undefined && item.data !== "" && item.id === "stop_list" && item.data.length) {
      const renderStopLists =  item.data.map((item, index) => {
        const renderRowsItem = (list, i, arr = []) => {
          arr.push(<label key={uuid()} style={styleCss.stopList.rowKey}>{`${i+1}: `}</label>)
          for (const key in list) {
            if (list.hasOwnProperty(key) && list[key] !== "-" && list[key] !== "" && list[key] !== null && list[key] !== "!^!  \r") {
              arr.push(
                <label key={uuid()} style={{marginRight: 5}}>
                  <label>{`${key} : `}</label>
                  <label style={{color: "red"}}>{list[key]}</label>
                </label>
              )
            }
          }
          return arr
        }
        return (
          <div key={index} >
            <label style={styleCss.stopList.rowTitle}> {`${item.report_name ? item.report_name : ""} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""}`}</label>
            { item.rows.map((list, i) =>
              <div key={i}>
                { renderRowsItem(list, i) }
              </div>
              )
            }
          </div>
        )
      })

      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <div style={styleCss.autoScroll}>{ renderStopLists }</div>
        </DescriptionsItem>
      )
    } else if ( item.data !== undefined && item.data !== "" && item.id !== "arbiter" && item.id !== "stop_list" && !Array.isArray(item.data)) {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <span style={{...styleCss.autoScroll, color: item.id === "spark_spiski" ? "" : "red"}}>{ item.data }</span>
        </DescriptionsItem>
      )
    } else if(item.id === "arbiter" && item.data !== "" && item.id !== "stop_list") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <RenderAbiterTable />
        </DescriptionsItem>
      )
    } else if (Array.isArray(item.data) && item.id !== "stop_list") {
      const itemArray = item.data.map((el, key) => <span key={key} style={{color: item.id === "spark_spiski" ? "" : "red"}}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <div style={styleCss.autoScroll}>{ itemArray }</div>
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
        <Spin spinning={loading} tip="Запрос данных по стоп-листам">
          <Descriptions size="small" bordered border column={{md:3, sm:1, xs:1}}>
            {renderDescriptionFields}
          </Descriptions>
        </Spin>
      </Panel>
    </Collapse> 
  )
}

export default StopListData
