import React from 'react'
import { Collapse, Row, Col, Icon } from 'antd';
import { trasform } from "../../../../../services/transformData";

const CollapceItem = props => {
  const Panel = Collapse.Panel;
  const { companySource, riskSource } = props
  // const { managementSource } = props

  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  // const managementInfo = trasform._managementSource(managementSource)
  // const riskInfo = trasform._transformAllData(riskSource)

  // console.log('fullOrganistionInfo', fullOrganistionInfo)
  // console.log('managementInfo', managementInfo)
  // console.log('riskInfo', riskInfo)

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

  const renderRiskFactorInfo = () => {
    return (
      <>
        <Panel header="Арбитраж" key="1" showArrow={false}>
            <div>{renderFieldArr}</div>
          </Panel>
          <Panel header="Стоп-лист аналитика" key="2" forceRender>
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
    <>
      { companySource ?
        <Collapse 
          defaultActiveKey={['1']} 
          onChange={callback}
          expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}
        >
          { renderLeftSideInfo() }
        </Collapse> : null
      }
      { riskSource ?
        <Collapse 
          defaultActiveKey={['1']} 
          onChange={callback}
          expandIcon={({isActive}) => <Icon type="plus-square" rotate={isActive ? 90 : 0}/>}
        >
          { renderRiskFactorInfo() }
        </Collapse> : null
      }
    </>
  )
}

export { CollapceItem }
