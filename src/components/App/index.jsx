import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'
import { Layout } from "antd";
import SiderContainer from "../SiderContainer";
import FooterContainer from "../FooterContainer";
import ContentContainer from "../ContentContainer";
import history from '../../history'
import "./app.scss";

class App extends Component {

  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout style={{ minHeight: "100vh" }}>
          <SiderContainer />
          <Layout>
            <ContentContainer />
            <FooterContainer />
          </Layout>
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default App;
