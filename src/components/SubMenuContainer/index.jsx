import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Icon } from 'antd';

const SubMenuContainer = () => {
  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="1">
        <span className="sub-menu">
          <Link to='/open-an-account'>
            <Icon type="chrome" />
            <span>Открыть счет</span>
          </Link>
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <span className="sub-menu">
          <Icon type="solution" />
          <span>Конвертирование</span>
        </span>
      </Menu.Item>
    </Menu>
  )
}

export default SubMenuContainer
