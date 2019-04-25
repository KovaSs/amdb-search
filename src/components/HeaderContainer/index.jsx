import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import "./header.scss";

class HeaderContainer extends Component {
  state = {
    activePage: null
  }

  changeActivePage = e => {
    this.setState({
      activePage : e.key
    })
  }

  componentDidMount() {
    const { location } = this.props
    setTimeout(() => {
      switch (location.pathname) {
        case '/open-bill':
          this.setState({
            activePage : "1"
          })
          break;
        case '/credit-conveyor':
          this.setState({
            activePage : "2"
          })
          break;
        case '/early-warning-system':
          this.setState({
            activePage : "3"
          })
          break;
        default:
        this.setState({
          activePage : null
        })
      }
    }, 100);
  }

  render() {
    const { Header} = Layout;
    const { activePage } = this.state
    return (
      <Header>
        <Link to='/' onClick={ this.changeActivePage }>
            <div className="logo">
            <img className="logo-img" src={process.env.PUBLIC_URL + 'img/logo.png'} alt={"logo"} />
            <label className="logo-label">Газпромбанк</label>
          </div>
        </Link>
        <Menu
          selectedKeys={[`${activePage}`]}
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1" onClick={ this.changeActivePage }>
            <Link to='/open-bill'>
              <span>Открыть счет</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2" onClick={ this.changeActivePage }>
            <Link to='/credit-conveyor'>
              <span>Кредитный конвейер</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3" onClick={ this.changeActivePage }>
            <Link to='/electronic-bank-garantees'>
              <span>Електронные банковские гарантии</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4" onClick={ this.changeActivePage }>
            <Link to='/early-warning-system'>
              <span>Система раннего предупреждения</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderContainer)
