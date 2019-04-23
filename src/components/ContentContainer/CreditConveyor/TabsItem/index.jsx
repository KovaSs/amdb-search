import React from 'react';
import { Row, Col, Button, Table, Empty, Spin } from "antd";
import * as _ from 'lodash'
import { fieldsArr } from "./fields";

/** Console table */
const Field = (title, data) => ({ title, data })
let clgData = {}


const TabsItem = props => {
  const { organistionInfo, headers } = props

  const fullOrganistionInfo = fieldsArr.map( item => {
    const { source: companySource } = props
    
    const _dataTransform = item => {
      return item = [{
        key: '1',
        name: 'Истец',
        year: item.istec.year,
        year3: item.istec.year3,
      }, {
        key: '2',
        name: 'Ответчик',
        year: item.otvet.year,
        year3: item.otvet.year,
      }]
    };

    for (const el in companySource) {
      if(item.id === el && item.id === "arbiter") {
        let newData = _dataTransform(companySource[el])
        clgData[el] = new Field(item.title, newData)
        return _.assign(item, { "data" : newData})
      } else if(item.id === el ) {
        clgData[el] = new Field(item.title, companySource[el])
        return _.assign(item, { "data" : companySource[el]})
      }
    }
    return item
  })

  console.table(clgData)

  const showHeadsTableInfo = (tableName) => {
    const expandedRowRender = () => {
      const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        { title: 'Проверка в Google', dataIndex: 'operation', key: 'operation', render: () => <Button>Поиск</Button>},
      ];
  
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }

    let loadingDelay = false

    return (
      <>
        {
          loadingDelay ? 
          <Spin spinning={loadingDelay}>
            <Empty/>
          </Spin>
          :
          <Table
            className="tabs-info__table-children"
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        }
      </>
    );
  };

  const columns = [
    { title: 'ФИО', dataIndex: 'fio', key: 'name' },
    { title: 'ОГРН', dataIndex: 'ogrn', key: 'createdAt' },
    { title: 'Проверка в Google', key: 'operation', render: () => <Button>Проверить</Button> },
  ];

  const data = [];
  for (let i = 0; i < 2; ++i) {
    data.push({
      key: i,
      fio: 'Масюгина Жанна Ивановна',
      ogrn: '1117746763672',
    });
  }

  return (
    <>
      <Col className="tabs-info__lable-table">{tableName}</Col>
      <Table
        className="tabs-info__table-main"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        pagination={false}
      />
    </>
  )
}
  /** Рендеринг информационных полей организации */
  const renderFieldArr = fullOrganistionInfo.map(item => {
    if(item.data && item.id !== "arbiter") {
      const red = (item.id === "fns") ? " red" : ''
      return (
        <Row key={item.id} className="tabs-info__organisation-info">
          <Col span={8} className="lable">{ item.title }</Col>
          <Col span={16} className={'descr' + red}>{`${item.data}` }</Col>
        </Row>
      )
    } else {
      return null
    }
  })

  /** Рендеринг информации по арбитражу */
  const renderArbiterTable = () => {
    const columns = [{
      title: 'Роль',
      dataIndex: 'name',
    }, {
      title: 'За 12 месяцев',
      dataIndex: 'year',
    }, {
      title: 'За 3 года',
      dataIndex: 'year3',
    }];

    const dataArbiter = fullOrganistionInfo.filter(item => item.id === "arbiter")
    return (
      <>
        <Col className="lable-table">Арбитраж</Col>
        <Table
          columns={columns}
          dataSource={dataArbiter[0].data}
          bordered
          pagination={false}
        />
      </>
    )
  }


  const showOrganisationInfo = () => {
    return (
      <Row className="tabs-info__organisation">
        <Col span={18}>
          { renderFieldArr }
        </Col>
        <Col span={6}>
          { renderArbiterTable() }
        </Col>
      </Row>
    )
  }

  return (
    <>
      { organistionInfo ? showOrganisationInfo() : null }
      { headers ? showHeadsTableInfo() : null }
    </>
  )
}

export { TabsItem } 