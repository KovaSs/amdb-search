import React from 'react'
import { 
  Table, 
  Descriptions, 
  Spin, 
  Row, 
  Col, 
  Empty 
} from 'antd'
import { trasform, uuid } from "../../../../../../../../services/utils";

const styleCss = {
  autoScroll : {
    maxHeight: 102,
    minWidth: 300,
    overflowY: "auto",
    overflowX: "hidden"
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
  emptyData: {
    border: "1px solid #8080801a",
    padding: 10,
    margin: 0
  }
}

const StopListData = ({ riskInfo, arbiter, mainLoading, stopListsLoading, column }) => {
  const { Item : DescriptionsItem } = Descriptions;

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

  const showEmpty = (
    <Empty
      style={styleCss.emptyData}
      className="empty-data-documents"
      image={Empty.PRESENTED_IMAGE_SIMPLE} 
      description={ <span > Данные отстутствуют </span> } 
    />
  )

  const renderDescriptionFields = riskInfo.map(item => {
    if ( item.data !== undefined && item.data !== "" && item.id === "stop_list") {
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

      if(item.data.length) return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <div style={styleCss.autoScroll}>{ renderStopLists }</div>
        </DescriptionsItem>
      )
      else return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={1}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span> Упонинаний в списках стоп-листов не найдено </span> } /> 
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
    } else {
      return null
    }
  })

  return (
    <Spin 
      spinning={ mainLoading || stopListsLoading} 
      tip={ mainLoading ?
        "Запрос основной информации о кампании" :
        "Запрос данных по стоп-листам и спискам"
      }
    >
      { riskInfo.length ?
        <Descriptions size="small" bordered border column={column}>
          {renderDescriptionFields}
        </Descriptions> : showEmpty
      }
    </Spin>
  )
}

export default StopListData
