import React, { Component } from "react";
import { Layout, Menu, Icon, Tooltip } from "antd";
import { Link, withRouter } from "react-router-dom";
import "./sider-container.scss";

export class SiderContainer extends Component {
  state = {
    collapsed: true,
    activePage: null,
    menu : [
      {short: "ОС", full: "Открыть счет", link: "/open-bill", icon: "pie-chart"},
      {short: "KK", full: "Кредитный конвейер", link: "/credit-conveyor", icon: "info-circle"},
      {short: "ЭБГ", full: "Электронные банковские гарантии", link: "/electronic-bank-garantees", icon: "line-chart"},
      {short: "СРП", full: "Система раннего предупреждения", link: "/early-warning-system", icon: "desktop"},
    ]
  };

  changeActivePage = e => {
    this.setState({
      activePage: e.key
    });
  };

  componentDidMount() {
    const { location } = this.props;
    setTimeout(() => {
      switch (location.pathname) {
        case "/open-bill":
          this.setState({
            activePage: "1"
          });
          break;
        case "/credit-conveyor":
          this.setState({
            activePage: "2"
          });
          break;
        case "/electronic-bank-garantees":
          this.setState({
            activePage: "3"
          });
          break;
        case "/early-warning-system":
          this.setState({
            activePage: "4"
          });
          break;
        default:
          this.setState({
            activePage: null
          });
      }
    }, 100);
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  renderMenuItem = (data, collapsed, calback) => {
    const { Item: MenuItem } = Menu;
    return data.map( (item, key=0) => {
      return (
        <MenuItem key={key} onClick={calback}>
          {!collapsed ? (
            <Tooltip title={item.full} placement="right" style={{ marginLeft : "10px"}}>
              <Link to={item.link}>
                <Icon type={item.icon} />
                <span>{item.short}</span>
              </Link>
            </Tooltip>
          ) : (
            <Link to={item.link}>
              <Icon type={item.icon} />
              <span>{item.full}</span>
            </Link>
          )}
        </MenuItem>
      )
    })
  }

  render() {
    const { activePage, collapsed, menu } = this.state;
    const { Sider } = Layout;
    const hidden = collapsed ? " hidden" : ' '
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        className="sider-menu"
      >
        <Link to="/" onClick={this.changeActivePage}>
          <div className={"logo"  + hidden}>
            <img className="logo-img" src={process.env.PUBLIC_URL + 'img/logo.png'} alt={"logo"} />
            <label className={"logo-label" + hidden }>Газпромбанк</label>
          </div>
        </Link>
        <Menu selectedKeys={[`${activePage}`]} mode="inline" theme="dark">
          { this.renderMenuItem(menu, collapsed, this.changeActivePage) }
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(SiderContainer);
