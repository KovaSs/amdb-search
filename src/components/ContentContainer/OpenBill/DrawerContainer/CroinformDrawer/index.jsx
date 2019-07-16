import React from 'react';
import { Drawer, Spin, Descriptions, Tabs } from "antd";
import { htmlTransform } from '../../../../../services/utils'
import toggleDrawer from '../index'

const styleCss = {
  h2 : {
    marginLeft: 10
  }
}

const CroinformDrawer = props => {
  const {onClose, visible, croinformRes, loading, user} = props
  const { Item: DescriptionsItem } = Descriptions
  const { TabPane } = Tabs

  const styledIdentifyRes = user.hasOwnProperty('identifyInfo') ? htmlTransform(user.identifyInfo.html) : ""
  const styledCroinformHtmlRes = (croinformRes && croinformRes.html)? htmlTransform(croinformRes.html) : ""
  const croinformVectorRes = (croinformRes && croinformRes.hasOwnProperty('vector')) ? croinformRes.vector : []
  const croinformListsRes = (croinformRes && croinformRes.lists.length) ? croinformRes.lists : []


  const renderDescrList = (arr = []) => {
    const renderVector = croinformVectorRes.map((item, index) =>  <div key={index}>{item}</div> )
    const renderLists = croinformListsRes.map((item, index) =>  <div key={index}>{item}</div> )
    if (croinformRes.vector.length) {
      arr.push(
        <DescriptionsItem key="vector" label="Вектор заемщика" span={1} >
          { renderVector }
        </DescriptionsItem>
      )
    } 
    if(croinformRes.lists.length) {
      arr.push(
        <DescriptionsItem key="lists" label="Списки" span={1} >
          { renderLists }
        </DescriptionsItem>
      )
    }
    return arr
  }

    return (
      <Drawer
        width={"50%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <h2 style={styleCss.h2}>Результаты проверки</h2>
        <Tabs >
          { (croinformRes && (croinformRes.vector.length || croinformRes.lists.length)) &&
            <TabPane tab="Списки" key="1">
              <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
                <Descriptions
                  key="vector-descr"
                  size="small"
                  bordered
                  border
                  column={{ md: 1, sm: 1, xs: 1 }}
                >
                  { renderDescrList() }
                </Descriptions>
              </Spin>
            </TabPane>
          }
          { (croinformRes && croinformRes.html) &&
            <TabPane tab="Croinform" key="2">
              <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
                <iframe srcDoc={styledCroinformHtmlRes} frameBorder="0" title="crionform-data" width="100%" height="800px"></iframe>
              </Spin>
            </TabPane>
          }
          <TabPane tab="Идентификация" key="3">
            <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
              <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height="800px"></iframe>
            </Spin>
          </TabPane>
        </Tabs>
      </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)