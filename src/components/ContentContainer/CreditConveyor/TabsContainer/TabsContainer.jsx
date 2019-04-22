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
            <TabsItem organistionInfo />
          </TabPane>
          <TabPane tab="Руководители" key="2">
          <TabsItem headers />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export { TabsContainer }