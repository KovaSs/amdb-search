import React, { Component } from "react";
import { Layout, Breadcrumb } from "antd";
import SiderContainer from "../SiderContainer";
import BreadcrumbContainer from "../ContentContainer/BreadcrumbContainer";
import "./app.scss";
const { Header, Content, Footer } = Layout;

class App extends Component {

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SiderContainer />

        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <BreadcrumbContainer style={{ margin: "16px 0" }} />
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
