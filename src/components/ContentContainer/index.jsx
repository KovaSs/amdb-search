import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import StepsContainer from "./StepsContainer";
import { Layout} from 'antd';

export class ContentContainer extends Component {
  render() {
    const { Content } = Layout;
    return (
      <Content>
      {/* <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      <div className="ant-layout-content__data">
        <StepsContainer/>
        <SearchContainer/>
      </div>
    </Content>
    );
  }
}

export default ContentContainer;
