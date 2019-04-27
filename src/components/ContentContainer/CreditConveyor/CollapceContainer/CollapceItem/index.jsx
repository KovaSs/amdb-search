import React from 'react'
import { Collapse, Row, Col, Icon } from 'antd';
import * as _ from 'lodash'
import { fieldsArr } from "./fields";

/** Console table */
const Field = (title, data) => ({ title, data })
let clgData = {}

const CollapceItem = props => {
  const Panel = Collapse.Panel;
  const { source: companySource } = props

  /** Подготовка входящих данных */
  const fullOrganistionInfo = fieldsArr.map( item => {
    const { source: companySource } = props
    
    const _arbiterTransform = item => {
      return item = [{
        key: '1',
        name: 'Истец',
        year: item.istec.year,
        year3: item.istec.year3,
      }, {
        key: '2',
        name: 'Ответчик',
        year: item.otvet.year,
        year3: item.otvet.year,
      }]
    };

    const _headersTransform = item => {
      let i=0, newArr =[]
      item.map( elem => {
        newArr.push({
          key: i,
          fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
          inn: elem.inn,
        })
        i++
        return newArr
      })
      return newArr
    };

    for (const el in companySource) {
      if(item.id === el && item.id === "arbiter") {
        let newData = _arbiterTransform(companySource[el])
        clgData[el] = new Field(item.title, newData)
        return _.assign(item, { "data" : newData})
      } else if(item.id === el && item.id === "heads") {
        let newData = _headersTransform(companySource[el])
        clgData[el] = new Field(item.title, newData)
        return _.assign(item, { "data" : newData})
      } else if(item.id === el ) {
        clgData[el] = new Field(item.title, companySource[el])
        return _.assign(item, { "data" : companySource[el]})
      }
    }
    return item
  })
  /** Отображение табличной информации об ответе */
  console.table(clgData)



  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  /** Рендеринг информационных полей организации */
  const renderFieldArr = fullOrganistionInfo.map(item => {
    if(item.data && 
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
      item.id !== "full_name") {
      const red = (item.id === "fns" || item.id === "sanctions") ? " red" : ''
      return (
        <Row key={item.id} className="tabs-info__organisation-info">
          <Col span={8} className="lable">{ item.title }</Col>
          <Col span={16} className={'descr' + red}>{`${item.data}` }</Col>
        </Row>
      )
    } else {
      return null
    }
  })

  const renderLeftSideInfo = () => {
    return (
      <>
        <Panel header="Общая информация" key="1" showArrow={false}>
            <div>{renderFieldArr}</div>
          </Panel>
          <Panel header="Руководящие органы" key="2" forceRender>
            <Collapse onChange={callback} expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}>
              <Panel header="Связанные лица" key="1" forceRender>
                <Collapse onChange={callback} expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}>
                  <Panel header="Руководство" key="1" forceRender>
                    <div>{text}</div>
                  </Panel>
                  <Panel header="Собственники" key="2" forceRender>
                    <div>{text}</div>
                  </Panel>
                  <Panel header="Бенефициары" key="3" forceRender>
                    <div>{text}</div>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Совладельцы" key="2" forceRender>
                <div>{text}</div>
              </Panel>
            </Collapse>
          </Panel>
      </>
    )
  }

  // const renderHeadsOrgans = fullOrganistionInfo.filter(item => item.id === "heads" || item.id === "befenicials" || item.id === "founders_ul" || item.id === "founders_fl")
  const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

  return (
    <Collapse 
      defaultActiveKey={['1']} 
      onChange={callback}
      expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}
    >
      { companySource ? renderLeftSideInfo() : null }
    </Collapse>
  )
}

export { CollapceItem }
