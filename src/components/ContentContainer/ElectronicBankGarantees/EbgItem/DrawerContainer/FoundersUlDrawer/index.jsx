import React from 'react';
import { Drawer, Tabs, PageHeader, Collapse } from "antd"
import RiskFactorsDigets from './RiskFactorsDigets'
import CompanyInfoUl from './CompanyInfoUl'
import StopListData from '../../CollapceContainer/ManagmentContainer/FoundersUlItem/StopListData'
import toggleDrawer from '../index'

const FoundersUlDrawer = props => {
  const {onClose,
    visible, 
    nameUl,
    keyId,
    innUl,
    reqnumUl,
    companyUl,
    requestLoading,
    riskInfo = [],
    arbiter
  } = props
  const { TabPane } = Tabs
  const { Panel } = Collapse

  return (
    <Drawer
      width={"55%"}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      className="drawer-history"
    >
      <PageHeader 
        title="Результаты проверки"
        subTitle={`| ${nameUl}`}
      >
        <Tabs >
          <TabPane tab="Информация о кампании" key="1">
            <Collapse defaultActiveKey={['1', '2']} >
              <Panel header="Общая информация" key="1" showArrow={false}>
                <CompanyInfoUl 
                  companyUl={companyUl}
                  loading={requestLoading.getIn(["companyResponseUl", keyId], false)}
                />
              </Panel>
              <Panel header="Стоп-листы / Списки" key="2" showArrow={false}>
                <StopListData
                  keyId={keyId}
                  column={{md:1, sm:1, xs:1}}
                  mainLoading={requestLoading.getIn(["loadCompanyInfoUl", keyId], true)} 
                  stopListsLoading={requestLoading.getIn(["getStopListsUl", keyId], false)}
                  riskInfo={riskInfo} 
                  arbiter={arbiter}
                />
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane tab="Риск-факторы" key="2">
            <RiskFactorsDigets 
              visible={visible}
              keyId={keyId} 
              innUl={innUl} 
              reqnumUl={reqnumUl}
            />
          </TabPane>
        </Tabs>
      </PageHeader>
    </Drawer>
  )
}

export default toggleDrawer(FoundersUlDrawer)