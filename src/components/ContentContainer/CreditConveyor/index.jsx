import React, { Component } from "react";
import { Row, Col, Button, Tabs, Table, Empty, Spin } from "antd";
import SearchCompanyInput from "./SearchCompanyInput";
import "./сredit-сonveyor.scss"

//key render item
import idGenerator from 'react-id-generator';
const data = [
  { title: 'Иванов', age: 25, id: 'id1' },
  { title: 'Петров', age: 34, id: 'id2' },
  { title: 'Сидоров', age: 23, id: 'id3' },
  { title: 'Лебедев', age: 14, id: 'id4' },
  { title: 'Мокин', age: 6, id: 'id5' },
  { title: 'Исаев', age: 23, id: 'id6' },
  { title: 'Ванюшин', age: 83, id: 'id7' },
]

class AddTable extends Component {
  state = {
    people : data
  };

  sort = field => {
    const { people } = this.state
    // debugger;
    // let field = 'title';
    for (let i = 0; i < people.length; i ++){
      for (let j = i + 1; j < people.length; j ++){
        if (people[j][field] > people[i][field]){

          let tmp = people[i];
          people[i] = people[j];
          people[j] = tmp;
        }
      }
    }

    this.setState ({people})
    //people.sort((a,b) => a.title - b.title)
  }

  addNewPeople = () => {
    const {people} = this.state
    // console.log('people', people)
    people.push({
      title: 'Семенов', 
      age: 33,
      id: idGenerator('id-')
    })
    console.log('people', people)
    this.setState( {
      people
    })
  }

  render() {
    const {people} = this.state
    const addLinks = people.map(el => {
      return (
        <div key = {el.id}>
          <span
            onClick={e => this.sort(e.target.id)}
            id="title"
          > 
            {`${el.title}   `}
          </span>
          <span
            onClick={e => this.sort(e.target.id)}
            id="age"
          > 
            {el.age}
          </span>
          <br/>
        </div>
      )
    })
    return (
      <div>
        {addLinks}
        <button onClick={this.addNewPeople}>Добавить</button>
      </div>
    )
  }
}

export { AddTable }



class CreditConveyor extends Component {
  state = {
    showTabs: true,
  };

  callback = key => {
    console.log(key);
  }

  showOrganisationIngo = () => {
    const columns = [{
      title: 'Роль',
      dataIndex: 'name',
    }, {
      title: 'За 12 месяцев',
      dataIndex: 'mounth',
    }, {
      title: 'За 3 года',
      dataIndex: 'year',
    }];
    
    const data = [{
      key: '1',
      name: 'Истец',
      mounth: '0 руб (0)',
      year: '0 руб (0)',
    }, {
      key: '2',
      name: 'Ответчик',
      mounth: '500 руб. (1)',
      year: '500 руб. (1)',
    }];

    return (
      <Row className="tabs-info__organisation">
        <Col span={18}>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Полное наименование</Col>
            <Col span={16} className="descr">Общество с ограниченной ответственностью "Группа Компаний "Сервис Телеком"</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Сокрашеное наименование</Col>
            <Col span={16} className="descr">ООО ГК "Сервис Телеком"</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Тип компании</Col>
            <Col span={16} className="descr">Обычная компания</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Дата регистрации</Col>
            <Col span={16} className="descr">02.08.2017г.</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Статус</Col>
            <Col span={16} className="descr">Ликвидировано / Прекратило деятельность при присоединении / 2014-08-19</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Юридический адресс</Col>
            <Col span={16} className="descr">г. Москва, ул. Орджоникидзе, д. 11 стр. 1А</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Список телефонов</Col>
            <Col span={16} className="descr">(916)0383738</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Основной ОКВЭД</Col>
            <Col span={16} className="descr">68.20 / Аренда и управление собственным или арендованным недвижемым имуществом</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Численность персонала</Col>
            <Col span={16} className="descr">0...5</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Численность персонала по данным ФНС</Col>
            <Col span={16} className="descr">0</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Уставной капитал</Col>
            <Col span={16} className="descr">10000</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Индекс должносной осмотрительности</Col>
            <Col span={16} className="descr">23 / Низкий риск</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Индекс Финансового риска</Col>
            <Col span={16} className="descr">88 / высокий риск</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Исполнительные производства</Col>
            <Col span={16} className="descr">не найдено</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">ФНС</Col>
            <Col span={16} className="descr" style={{color : "red"}}>Залоги. Число уведлмлений о заголах движемого имущества (залогодатель) -2</Col>
          </Row>
          <Row className="tabs-info__organisation-info">
            <Col span={8} className="lable">Санкции</Col>
            <Col span={16} className="descr">не найдено</Col>
          </Row>
        </Col>
        <Col span={6}>
          <Col className="lable-table">Арбитраж</Col>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
          />
        </Col>
      </Row>
    )
  }

  showHeadsTableInfo = (tableName) => {
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
        {/* <AddTable/> */}
      </>
    )
  }

  showTabs = () => {
    const TabPane = Tabs.TabPane;
    return (
      <div className="tabs-info">
        <Tabs defaultActiveKey="2" onChange={this.callback} >
          <TabPane tab="Организация" key="1">{this.showOrganisationIngo()}</TabPane>
          <TabPane tab="Руководители" key="2">
            {this.showHeadsTableInfo('Руководители')}
            {this.showHeadsTableInfo('Совладельцы')}
            {this.showHeadsTableInfo('Бенефицары')}
          </TabPane>
        </Tabs>
      </div>
    )
  }

  render() {
    const { showTabs } = this.state
    return (
      <div className="credit-conveyor">
        <SearchCompanyInput/>
        <Col>
          {
            showTabs ? 
            this.showTabs() : 
            <div className="search-result-table">Информация о организации</div>
          }
        </Col>
      </div>
    );
  }
}

export default CreditConveyor;
