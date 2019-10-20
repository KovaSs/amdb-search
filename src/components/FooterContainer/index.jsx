import React, { Component } from 'react';
import { Layout} from 'antd';
import "./footer.scss"

export class FooterContainer extends Component {
  render() {
    const { Footer } = Layout;
    const date = new Date();
    return (
      <Footer className="footer-page-info">
        <img className="cot-logo-img" src={process.env.PUBLIC_URL + '/img/cot-logo.png'} alt={"logo"} />
        <b>ЦЕНТР ОТКРЫТЫХ СИСТЕМ</b> ©{ date.getFullYear() }
      </Footer>
    )
  }
}

export default FooterContainer
