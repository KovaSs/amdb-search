import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from "antd";

const BreadcrumbContainer = props => {
  const { pathname } = props.location
  console.log('pathname', pathname)

  const renderPageName = pathname => {
    switch (pathname) {
      case "/open-bill":
        return "Открыть счет"
      case "/credit-conveyor":
        return "Кредитный конвейер"
      case "/electronic-bank-garantees":
        return "Электронные банковские гарантии"
      case "/early-warning-system":
        return "Система раннего предупреждения"
      default:
        break;
    }
  }

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item><Link to="/">Главная</Link></Breadcrumb.Item>
      <Breadcrumb.Item>{renderPageName(pathname)}</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default withRouter(BreadcrumbContainer)
