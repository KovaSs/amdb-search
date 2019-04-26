import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from "antd";

const BreadcrumbContainer = props => {
  const { pathname } = props.location

  const renderPageName = () => {
    switch (pathname) {
      case "/open-bill":
        return <Breadcrumb.Item>Открыть счет</Breadcrumb.Item>
        case "/credit-conveyor":
        return <Breadcrumb.Item>Кредитный конвейер</Breadcrumb.Item>
        case "/electronic-bank-garantees":
        return <Breadcrumb.Item>Электронные банковские гарантии</Breadcrumb.Item>
        case "/early-warning-system":
        return <Breadcrumb.Item>Система раннего предупреждения</Breadcrumb.Item>
      default:
        break;
    }
  }

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item><Link to="/" >Главная</Link></Breadcrumb.Item>
      { renderPageName() }
    </Breadcrumb>
  )
}

export default withRouter(BreadcrumbContainer)
