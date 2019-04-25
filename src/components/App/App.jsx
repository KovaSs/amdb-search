import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import SiderContainer from "../SiderContainer";
import FooterContainer from "../FooterContainer";
import ContentContainer from "../ContentContainer";
import "./app.scss";
const { Header } = Layout;

class App extends Component {

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "90vh" }}>
          <SiderContainer />
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }} />
            <ContentContainer />
            <FooterContainer />
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
