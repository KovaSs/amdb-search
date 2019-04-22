import React, { Component } from 'react';
import { Tabs } from "antd";
import { TabsItem } from "../TabsItem";

class TabsContainer extends Component {
  render() {
    const TabPane = Tabs.TabPane;
    return (
      <div className="tabs-info">
        <Tabs defaultActiveKey="1" onChange={this.callback} >
          <TabPane tab="Организация" key="1">
            <TabsItem />
          </TabPane>
          <TabPane tab="Руководители" key="2">
            Таб №2
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export { TabsContainer }