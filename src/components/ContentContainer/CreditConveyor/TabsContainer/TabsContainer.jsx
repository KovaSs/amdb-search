import React, { Component } from 'react';
import { Tabs } from "antd";
import { TabsItem } from "../TabsItem";

class TabsContainer extends Component {
  
  render() {
    const TabPane = Tabs.TabPane;
    const { companyResponse : { heads, management_companies, founders_fl, founders_ul, befenicials, ...companySource}} = this.props.store
    const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
    console.log('companyResponse', companySource)
    return (
      <div className="tabs-info">
        <Tabs defaultActiveKey="1" onChange={this.callback} >
          <TabPane tab="Организация" key="1">
            <TabsItem organistionInfo source={companySource} />
          </TabPane>
          <TabPane tab="Руководители" key="2">
          <TabsItem headers source={managementSource} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export { TabsContainer }