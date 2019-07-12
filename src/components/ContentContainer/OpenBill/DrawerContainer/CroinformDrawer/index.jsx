import React from 'react';
import { Drawer, Collapse, Icon, Spin } from "antd";
import { htmlTransform } from '../../../../../services/utils'
import toggleDrawer from '../index'

const CroinformDrawer = props => {
  const {onClose, visible, croinformRes, loading, user} = props
  const { Panel } = Collapse
  // if(!croinformRes) return <div></div>

  const styledIdentifyRes = user.hasOwnProperty('identifyInfo') ? htmlTransform(user.identifyInfo.html) : ""

  const styledCroinformRes = croinformRes ? htmlTransform(croinformRes) : ""

    return (
      <Drawer
        width={"50%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
        >
          <Panel header="Результат идентификации" key="1" showArrow={false}>
            <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
              <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height="800px"></iframe>
            </Spin>
          </Panel>
          { croinformRes && 
            <Panel header="Результат проверки Croinform.ru" key="2" showArrow={false}>
              <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
                <iframe srcDoc={styledCroinformRes} frameBorder="0" title="crionform-data" width="100%" height="800px"></iframe>
              </Spin>
            </Panel>
          }
        </Collapse>
      </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)