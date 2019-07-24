import React from 'react'
import { Descriptions, Spin, Empty } from 'antd'

/** CSS стили */
const styleCss = {
  autoScroll : {
    maxHeight: 102,
    overflowY: "auto"
  }
}

const MainCompanyData = ({fields, loading}) => {
  /** Рендеринг информационных полей об организации */
  const renderCompanySourceDescriptionFields = fields.filter(item => {
    return item.id !== "arbiter" && 
      item.id !== "befenicials" && 
      item.id !== "founders_fl" && 
      item.id !== "founders_ul" && 
      item.id !== "heads"  && 
      item.id !== "fl"  && 
      item.id !== "ul"  && 
      item.id !== "heads_ul"  && 
      item.id !== "heads_fl"  && 
      item.id !== "share_holders_fl"  && 
      item.id !== "share_holders_ul"  && 
      item.id !== "leaders_list"  && 
      item.id !== "management_companies" && 
      item.id !== "name"  && 
      item.id !== "fns"  && 
      item.id !== "stop_list"  && 
      item.id !== "sanctions"  && 
      item.id !== "inn"  && 
      item.id !== "spiski"  && 
      item.id !== "arbiter_other"  && 
      item.id !== "spark_spiski"  && 
      item.id !== "ogrn"  && 
      item.id !== "isponlit_proizvodstva"  && 
      item.id !== "full_name" &&
      item.id !== "birthdate" && 
      item.id !== "birth_place" &&
      item.id !== "sex"
  }).map(item => {
    const { Item : DescriptionsItem } = Descriptions
    // const notFoundText = "—"
    const notFoundText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } />

    if ( item.id === "phone_list") {
      if(Array.isArray(item.data)) {
        const itemArray = item.data.map((el, key) => <a href={`tel:${el}`} key={item.id + '_' + key}>{el} </a>)
        return (
          <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 4 ? 2 : 1}>
            <div style={styleCss.autoScroll}>
              { item.data !== "" ? itemArray :  notFoundText }
            </div>
          </DescriptionsItem>
        )
      } else {
        return (
          <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>
            { 
              item.data !== "" ? <a href={`tel:${item.data}`} key={item.id}> { item.data } </a> : notFoundText
            }
          </DescriptionsItem>
        )
      }
    } else if (!Array.isArray(item.data) && item.id === "index_of_due_diligence") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 20 ? 2 : 1}>
          {item.data !== "" ? item.data : notFoundText} 
        </DescriptionsItem>
      )
    } else if(Array.isArray(item.data) && item.id === "previous_address") {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 3 ? 2 : 1}>
          <div style={styleCss.autoScroll}>{ item.data !== "" ? itemArray :  notFoundText }</div>
        </DescriptionsItem>
      )
    } else if(Array.isArray(item.data)) {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={2}>
          <div style={styleCss.autoScroll}>{ item.data !== "" ? itemArray :  notFoundText }</div>
        </DescriptionsItem>
      )
    } else if(item.id === "status") {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>
          <label style={{color: item.data.indexOf("Действующее") !== -1 ? "#3fd03f" : "red"}}>
            { item.data !== "" ? item.data : notFoundText }
          </label>
        </DescriptionsItem>
      )
    } else {
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>
          { item.data !== "" ? item.data : notFoundText }
        </DescriptionsItem>
      )
    }
  })

  return (
    <Spin spinning={loading}>
      <Descriptions bordered border size="small" span={2} column={{xxl:3, xl:3, lg: 2, md:2, sm:2, xs:1}}>
        { renderCompanySourceDescriptionFields }
      </Descriptions>
    </Spin>
  )
}

export default MainCompanyData
