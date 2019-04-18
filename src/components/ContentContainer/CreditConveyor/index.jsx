import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Select, Tabs } from "antd";
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
    return (
      <div className="tabs-info__organisation">
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Полное наименование</Col>
          <Col span={18} className="descr">Общество с ограниченной ответственностью "Группа Компаний "Сервис Телеком"</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Сокрашеное наименование</Col>
          <Col span={18} className="descr">ООО ГК "Сервис Телеком"</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Тип компании</Col>
          <Col span={18} className="descr">Обычная компания</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Дата регистрации</Col>
          <Col span={18} className="descr">02.08.2017г.</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Статус</Col>
          <Col span={18} className="descr">Действующее / Действующее / 15.04.2019</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Юридический адресс</Col>
          <Col span={18} className="descr">г.Москва, улюПятницкая, д.54 корп.2 кв.5</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Список телефонов</Col>
          <Col span={18} className="descr">(916)0383738</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Основной ОКВЭД</Col>
          <Col span={18} className="descr">68.20 / Аренда и управление собственным или арендованным недвижемым имуществом</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Численность персонала</Col>
          <Col span={18} className="descr">0...5</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Численность персонала по данным ФНС</Col>
          <Col span={18} className="descr">0</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Уставной капитал</Col>
          <Col span={18} className="descr">10000</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Индекс должносной осмотрительности</Col>
          <Col span={18} className="descr">23 / Низкий риск</Col>
        </Row>
        <Row className="tabs-info__organisation-info">
          <Col span={6} className="lable">Индекс Финансового риска</Col>
          <Col span={18} className="descr">88 / высокий риск</Col>
        </Row>
      </div>
    )
  }

  showTabs = () => {
    const TabPane = Tabs.TabPane;
    return (
      <div className="tabs-info">
        <Tabs onChange={this.callback} type="card">
          <TabPane tab="Организация" key="1">{this.showOrganisationIngo()}</TabPane>
          <TabPane tab="Руководители" key="2">Content of Tab Pane 2</TabPane>
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
