import React, { Component } from 'react';
import { Layout} from 'antd';

export class FooterContainer extends Component {
  render() {
    const { Footer } = Layout;
    const date = new Date();
    return (
      <Footer>
        <img className="cot-logo-img" src={process.env.PUBLIC_URL + '/img/cot-logo.png'} alt={"logo"} />
        <b>ЦЕНТР ОТКРЫТЫХ СИСТЕМ</b> ©{ date.getFullYear() }
      </Footer>
    )
  }
}

export default FooterContainer
