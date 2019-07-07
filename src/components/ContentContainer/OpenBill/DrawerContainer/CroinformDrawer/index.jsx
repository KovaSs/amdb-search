import React from 'react';
import { Drawer, Collapse, Icon, Spin } from "antd";
import toggleDrawer from '../index'
import './drawer-croinform.scss'

const CroinformDrawer = props => {
  const {onClose, visible, croinformRes, loading} = props
  const { Panel } = Collapse
  if(!croinformRes) return <div></div>
  const styledRes = croinformRes
    .replace(/id="header"/g, 'id="header" style="display:none"')
    .replace(/id="paper"/g, 'id="paper" style="padding-top:0"')
    .replace(/id="requestInfo"/g, 'id="requestInfo" style="top:2rem"')
    .replace(/id="content"/g, 'id="content" style="padding-top: 0;"')
    .replace(/class="mid"/g, 'class="mid" style="font-size: 1rem;"')
    .replace(/<table/g, '<table style="width: 100%; font-size: 1rem;"')
    .replace(/\/\* Основные стили \*\//g, '/* Основные стили */ u{background-color: yellow;}')
    .replace(/<i/g, '<i style="font-size: 1rem;"')
    .replace(/<h2/g, '<h2 style="font-size: 1.5rem; font-weight: 500;"')
    .replace(/<h3/g, '<h3 style="font-size: 1.2rem; font-weight: 500;"')
    .replace(/<h5/g, '<h5 style="font-size: 1.5rem; font-weight: 500;"')
    .replace(/<th/g, '<th style="font-weight: 500;"')

    return (
      <Drawer
        width={"50%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
          expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
        >
          <Panel header="Результат проверки Croinform.ru" key="1" showArrow={false}>
            <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
              <iframe srcDoc={styledRes} frameBorder="0" title="crionform-data" width="100%" height="800px"></iframe>
            </Spin>
          </Panel>
        </Collapse>
      </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)