import * as React from "react";
import { ConnectedRouter } from 'connected-react-router'
import { Layout } from "antd";
import SiderContainer from "../SiderContainer";
import FooterContainer from "../FooterContainer";
import ContentContainer from "../ContentContainer";
import history from '../../history'
import "./app.scss";

class App extends React.Component {
  public render() {
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
