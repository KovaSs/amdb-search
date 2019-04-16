import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
// import "./header.scss";

export class HeaderContainer extends Component {
  render() {
    const { Header} = Layout;
    return (
      <Header>
        <Link to='/'>
          <div className="logo" />
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">
            <Link to='/open-bill'>
              <span>Открыть счет</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to='/credit-conveyor'>
              <span>Кредитный конвейер</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to='/early-warning-system'>
              <span>Система раннего предупреждения</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default HeaderContainer;
