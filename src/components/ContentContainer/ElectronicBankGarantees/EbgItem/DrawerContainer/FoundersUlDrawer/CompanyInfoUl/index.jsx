import React from 'react'
import { Descriptions, Spin, Empty } from 'antd'

/** CSS стили */
const styleCss = {
  autoScroll : {
    maxHeight: 102,
    // minWidth: 350,
    overflowY: "auto",
    overflowX: "hidden"
  },
  descrTitle: {
    maxWidth: 200,
    whiteSpace: "normal"
  },
  strong: {
    fontWeight: 600
  }
}

const MainCompanyDataUl = ({companyUl, loading}) => {
  /** Рендеринг информационных полей об организации */
  const renderCompanySourceDescriptionFields = companyUl.map(item => {
    const { Item : DescriptionsItem } = Descriptions
    const notFoundText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } />
    const descrTitle = <div style={styleCss.descrTitle}>{item.title}</div>

    if ( item.id === "phone_list") {
      if(Array.isArray(item.data)) {
        const itemArray = item.data.map((el, key) => <a href={`tel:${el}`} key={item.id + '_' + key}>{el} </a>)
        return (
          <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle } span={item.data.length > 4 ? 1 : 1}>
            <div style={styleCss.autoScroll}>
              { item.data !== "" ? itemArray :  notFoundText }
            </div>
          </DescriptionsItem>
        )
      } else {
        return (
          <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle }>
            { 
              item.data !== "" ? <a href={`tel:${item.data}`} key={item.id}> { item.data } </a> : notFoundText
            }
          </DescriptionsItem>
        )
      }
    } else if (!Array.isArray(item.data) && item.id === "index_of_due_diligence") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle } span={item.data.length > 20 ? 1 : 1}>
          <div style={styleCss.autoScroll}>{item.data !== "" ? item.data : notFoundText}</div>
        </DescriptionsItem>
      )
    } else if(Array.isArray(item.data) && (item.id === "previous_address" || item.id === "workers_range_fns")) {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle } span={item.data.length > 3 ? 1 : 1}>
          <div style={styleCss.autoScroll}>{ item.data !== "" ? itemArray :  notFoundText }</div>
        </DescriptionsItem>
      )
    } else if(Array.isArray(item.data)) {
      const itemArray = item.data.map((el, key) => <span key={key}><label style={styleCss.strong}>{key+1}:</label> {el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle } span={1}>
          <div style={styleCss.autoScroll}>{ item.data !== "" ? itemArray :  notFoundText }</div>
        </DescriptionsItem>
      )
    } else if(item.id === "status") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle }>
          <label style={{color: item.data.indexOf("Действующее") !== -1 ? "#3fd03f" : "red"}}>
            { item.data !== "" ? item.data : notFoundText }
          </label>
        </DescriptionsItem>
      )
    } else {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ descrTitle }>
          { item.data !== "" ? item.data : notFoundText }
        </DescriptionsItem>
      )
    }
  })

  return (
    <Spin spinning={loading}>
      <Descriptions bordered border size="small" span={1} column={1}>
        { renderCompanySourceDescriptionFields }
      </Descriptions>
    </Spin>
  )
}

export default MainCompanyDataUl
