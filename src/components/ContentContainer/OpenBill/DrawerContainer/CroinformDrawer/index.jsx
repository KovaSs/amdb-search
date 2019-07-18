import React from 'react';
import { Drawer, Spin, Descriptions, Tabs, Collapse, Empty } from "antd";
import { htmlTransform, htmlTransformFssp } from '../../../../../services/utils'
import toggleDrawer from '../index'

const styleCss = {
  h2 : {
    marginLeft: 10
  }
}

const CroinformDrawer = props => {
  const {onClose, visible, croinformRes, loading, user , fsspInfo, fssploading} = props
  const { Item: DescriptionsItem } = Descriptions
  const { TabPane } = Tabs
  const { Panel } = Collapse

  const styledIdentifyRes = user.hasOwnProperty('identifyInfo') ? htmlTransform(user.identifyInfo.html) : ""
  const styledfsspInfo = fsspInfo ? htmlTransformFssp(fsspInfo) : ""
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

  const renderList = () => {
    return (
      <TabPane tab="Списки" key="1">
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
        >
          <Panel header="Списки" key="1" showArrow={false}>
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
          </Panel>
          <Panel header="Данные ФССП" key="2" showArrow={false}>
            <Spin spinning={fssploading} tip="Идет поиск данных в ФССП">
              { fsspInfo ?
                <iframe srcDoc={styledfsspInfo} frameBorder="0" title="identify-data" width="100%" height="600px"/> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span> Данные отвутствуют </span> } />
              }
            </Spin>
          </Panel>
        </Collapse>
      </TabPane>
    )
  }

    return (
      <Drawer
        width={"55%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <h2 style={styleCss.h2}>Результаты проверки</h2>
        <Tabs >
          { (croinformRes && (croinformRes.vector.length || croinformRes.lists.length || fsspInfo.length)) && renderList() }
          { (croinformRes && croinformRes.html) &&
            <TabPane tab="Croinform" key="2">
              <Tabs >
                <TabPane tab="Croinform" key="1">
                  <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
                    <iframe srcDoc={styledCroinformHtmlRes} frameBorder="0" title="crionform-data" width="100%" height={`${window.innerHeight*0.79}px`}/>
                  </Spin>
                </TabPane>
                <TabPane tab="Идентификация" key="2">
                  <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
                    <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.79}px`}/>
                  </Spin>
                </TabPane>
              </Tabs>
            </TabPane>
          }
          { (styledIdentifyRes && !styledCroinformHtmlRes) ?
            <TabPane tab="Идентификация" key="1">
              <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
                <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.84}px`}/>
              </Spin>
            </TabPane> : null
          }
        </Tabs>
      </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)