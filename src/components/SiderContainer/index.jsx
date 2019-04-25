import React, { Component } from 'react';
import { Layout, Menu, Icon } from "antd";
import { Link, withRouter } from 'react-router-dom';
import './sider-container.scss'


export class SiderContainer extends Component {
  state = {
    collapsed: false,
    activePage: null
  };

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
        case '/electronic-bank-garantees':
          this.setState({
            activePage : "3"
          })
          break;
        case '/early-warning-system':
          this.setState({
            activePage : "4"
          })
          break;
        default:
        this.setState({
          activePage : null
        })
      }
    }, 100);
  }
  
  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  
  render() {
    const { activePage } = this.state
    const { Item : MenuItem } = Menu
    // const SubMenu = Menu.SubMenu;
    const { Sider } = Layout;
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        <Link to='/' onClick={ this.changeActivePage }>
          <div className="logo">
            <img className="logo-img" src={process.env.PUBLIC_URL + 'img/logo.png'} alt={"logo"} />
            <label className="logo-label">Газпромбанк</label>
          </div>
        </Link>
        <Menu 
          selectedKeys={[`${activePage}`]} 
          mode="inline"
          theme="dark" 
        >
          <MenuItem key="1" onClick={ this.changeActivePage }>
            <Link to='/open-bill'>
              <Icon type="pie-chart" />
              <span>Открыть счет</span>
            </Link>
          </MenuItem>
          <MenuItem key="2" onClick={ this.changeActivePage }>
            <Link to='/credit-conveyor'>
              <Icon type="info-circle" />
              <span>Кредитный конвейер</span>
            </Link>
          </MenuItem>
          <MenuItem key="3" onClick={ this.changeActivePage }>
            <Link to='/electronic-bank-garantees'>
              <Icon type="line-chart" />
              <span>Электронные банковские гарантии</span>
            </Link>
          </MenuItem>
          <MenuItem key="4" onClick={ this.changeActivePage }>
            <Link to='/early-warning-system'>
              <Icon type="desktop" />
              <span>Система раннего предупреждения</span>
            </Link>
          </MenuItem>
          {/* <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <MenuItem key="3">Tom</MenuItem>
            <MenuItem key="4">Bill</MenuItem>
            <MenuItem key="5">Alex</MenuItem>
          </SubMenu> */}
        </Menu>
      </Sider>
    )
  }
}

export default withRouter(SiderContainer)
