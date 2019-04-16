import React, { Component } from 'react';
import { Layout} from 'antd';

export class FooterContainer extends Component {
  render() {
    const { Footer } = Layout;
    const date = new Date();
    return (
      <Footer>
        <b>ГАЗПРОМБАНК</b> ©{ date.getFullYear() }
      </Footer>
    )
  }
}

export default FooterContainer
