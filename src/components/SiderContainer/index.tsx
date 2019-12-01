import * as React from "react";
import { Layout, Menu, Icon, Tooltip } from "antd";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import "./sider-container.scss";

interface IProps extends RouteComponentProps<any> {
}

export class SiderContainer extends React.Component<IProps> {
  state = {
    collapsed: true,
    activePage: null,
    menu : [
      {short: "Открытие счета", full: "Открытие счета", link: "/open-bill", icon: "pie-chart"},
      // {short: "Кредитный конвеер", full: "Кредитный конвейер", link: "/credit-conveyor", icon: "info-circle"},
      {short: "Электронные банковские гарантии", full: "Электронные банковские гарантии", link: "/electronic-bank-garantees", icon: "line-chart"},
      // {short: "Система раннего предупреждения", full: "Система раннего предупреждения", link: "/early-warning-system", icon: "desktop"},
      {short: "Поиск по стоп-листам", full: "Поиск по стоп-листам", link: "/stop-lists-search", icon: "alert"},
    ]
  };

  public componentDidMount() {
    const { location } = this.props;
    setTimeout(() => {
      switch (location.pathname) {
        case "/open-bill":
          this.setState({
            activePage: "0"
          });
          break;
        // case "/credit-conveyor":
        //   this.setState({
        //     activePage: "1"
        //   });
        //   break;
        case "/electronic-bank-garantees":
          this.setState({
            activePage: "1"
          });
          break;
        case "/early-warning-system":
          this.setState({
            activePage: "2"
          });
          break;
        case "/stop-lists-search":
          this.setState({
            activePage: "3"
          });
          break;
        default:
          this.setState({
            activePage: null
          });
      }
    }, 100);
  }

  private changeActivePage = (e: any) => {
    this.setState({
      activePage: e.key
    });
  };


  private onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  private renderMenuItem = (data:any, collapsed:any, calback:any) => {
    const { Item: MenuItem } = Menu;
    return data.map( (item:any, key:any) => {
      return (
        <MenuItem key={key} onClick={calback}>
          {!collapsed ? (
            <Tooltip title={item.full} placement="right" style={{ marginLeft : "10px"}}>
              <NavLink to={item.link}>
                <Icon type={item.icon} />
                <span>{item.short}</span>
              </NavLink>
            </Tooltip>
          ) : (
            <NavLink to={item.link}>
              <Icon type={item.icon} />
              <span>{item.full}</span>
            </NavLink>
          )}
        </MenuItem>
      )
    })
  }

  public render() {
    const { activePage, collapsed, menu } = this.state
    const { Sider } = Layout
    const hidden = collapsed ? " hidden" : ' '
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        className="sider-menu"
      >
        <NavLink to="/" onClick={this.changeActivePage}>
          <div className={"logo"  + hidden}>
            <img className="logo-img" src={process.env.PUBLIC_URL + '/img/logo_small.png'} alt={"logo"} />
            <label className={"logo-label title" + hidden }> Газпромбанк </label>
            <label className={"logo-label sub-title" + hidden }> Безопасность </label>
          </div>
        </NavLink>
        <Menu selectedKeys={[`${activePage}`]} mode="inline" theme="dark">
          { this.renderMenuItem(menu, collapsed, this.changeActivePage) }
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(SiderContainer);
