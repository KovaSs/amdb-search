import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Select, Tabs, Table, Empty, Spin } from "antd";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    inn: '',
    ogrn: '',
    showTabs: true
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {prefix, data} = values;
      if( prefix === 'inn' && data) {
        this.setState(({inn}) => ({
          inn : data,
          ogrn : '',
          showTabs: true
        }))
      } else if(prefix === 'ogrn'  && data) {
        this.setState(({ogrn, inn}) => ({
          ogrn : data,
          inn : '',
          showTabs: true
        }))
      } else {
        this.setState(({ogrn, inn}) => ({
          ogrn : '',
          inn : '',
          showTabs: false
        }))
      }
      if (!err) {
        console.log('Полученные значения формы: ', values);
      }
    });
  }

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

  showHeadsTableInfo = () => {
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
    for (let i = 0; i < 1; ++i) {
      data.push({
        key: i,
        fio: 'Масюгина Жанна Ивановна',
        ogrn: '1117746763672',
      });
    }
    
    return (
      <Table
        className="tabs-info__table-main"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        pagination={false}
      />
    )
  }

  showTabs = () => {
    const TabPane = Tabs.TabPane;
    return (
      <div className="tabs-info">
        <Tabs defaultActiveKey="2" onChange={this.callback} >
          <TabPane tab="Организация" key="1">{this.showOrganisationIngo()}</TabPane>
          <TabPane tab="Руководители" key="2">{this.showHeadsTableInfo()}</TabPane>
        </Tabs>
      </div>
    )
  }

  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'inn',
    })(
      <Select style={{ width: 80 }}>
        <Option value="inn">ИНН</Option>
        <Option value="ogrn">ОГРН</Option>
      </Select>
    );
    return (
      <Row>
        <Col span={24}>Поиск организации:</Col>
        <Col span={23}>
          <Form.Item >
            {getFieldDecorator('data', {
              rules: [{ required: true, message: 'Строка поиска не должна быть пустой!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col span={1}>
          <Button className="search-btn" type="primary" htmlType="submit">Поиск</Button>
        </Col>
      </Row>
    )
  }

  render() {
    const { showTabs } = this.state
    // console.log(`state`, this.state)
    return (
      <div className="credit-conveyor">
        <Col>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
            {this.getFields()}
          </Form>
        </Col>
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

const WrappedRegistrationForm = Form.create({ name: 'searh-company' })(CreditConveyor);


export default WrappedRegistrationForm;
