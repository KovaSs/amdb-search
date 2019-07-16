import React from 'react'
import { Descriptions, Spin } from 'antd'

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
    return item.data && 
      item.id !== "arbiter" && 
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
      item.id !== "sanctions"  && 
      item.id !== "inn"  && 
      item.id !== "spiski"  && 
      item.id !== "arbiter_other"  && 
      item.id !== "spark_spiski"  && 
      item.id !== "ogrn"  && 
      item.id !== "isponlit_proizvodstva"  && 
      item.id !== "full_name"
  }).map(item => {
    const { Item : DescriptionsItem } = Descriptions;
    if (Array.isArray(item.data) && item.id === "phone_list") {
      const itemArray = item.data.map((el, key) => <a href={`tel:${el}`} key={item.id + '_' + key}>{el} </a>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 4 ? 2 : 1}>
          <div style={styleCss.autoScroll}>{ itemArray }</div>
        </DescriptionsItem>
      )
    } else if(!Array.isArray(item.data) && item.id === "phone_list") {
      return <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }><a href={`tel:${item.data}`} key={item.id}>{item.data} </a></DescriptionsItem>
    } else if(!Array.isArray(item.data) && item.id === "index_of_due_diligence") {
      return <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 20 ? 2 : 1}>{item.data}</DescriptionsItem>
    } else if(Array.isArray(item.data) && item.id === "previous_address") {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={item.data.length > 3 ? 2 : 1}>
          { itemArray }
        </DescriptionsItem>
      )
    } else if(Array.isArray(item.data)) {
      const itemArray = item.data.map((el, key) => <span key={key}>{el} <br /> </span>)
      return (
        <DescriptionsItem id={ item.id } key={ item.id } label={ item.title } span={2}>
          <div style={styleCss.autoScroll}>{ itemArray }</div>
        </DescriptionsItem>
      )
    } else {
      return <DescriptionsItem id={ item.id } key={ item.id } label={ item.title }>{ item.data }</DescriptionsItem>
    }
  })

  return (
    <Spin spinning={loading}>
      <Descriptions bordered border size="small" span={2} column={{xxl:3, xl:3, lg: 3, md:3, sm:2, xs:1}}>
        { renderCompanySourceDescriptionFields }
      </Descriptions>
    </Spin>
  )
}

export default MainCompanyData
