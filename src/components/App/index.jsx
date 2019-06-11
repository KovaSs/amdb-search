import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import SiderContainer from "../SiderContainer";
import FooterContainer from "../FooterContainer";
import ContentContainer from "../ContentContainer";
import "./app.scss";

class App extends Component {

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <SiderContainer />
          <Layout>
            <ContentContainer />
            <FooterContainer />
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
