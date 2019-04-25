import React, { Component } from "react";
import HeaderContainer from '../HeaderContainer';
import ContentContainer from '../ContentContainer';
import FooterContainer from '../FooterContainer';
import { BrowserRouter as Router } from "react-router-dom";
import { Layout} from 'antd';
import "./app.scss";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout className="layout">
          <HeaderContainer/>
          <ContentContainer/>
          <FooterContainer/>
        </Layout>
      </Router>
    );
  }
}

export default App;
