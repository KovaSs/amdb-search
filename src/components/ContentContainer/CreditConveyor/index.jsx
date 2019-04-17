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
      if( prefix === 'inn') {
        this.setState(({inn}) => ({
          inn : data,
          ogrn : ''
        }))
      } else if(prefix === 'ogrn') {
        this.setState(({ogrn, inn}) => ({
          ogrn : data,
          inn : '',
        }))
      } else {
        this.setState(({ogrn, inn}) => ({
          ogrn : '',
          inn : ''
        }))
      }
      if (!err) {
        this.setState(({lodad}) => ({
          showTabs : true
        }))
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
        <Row>
          <Col span={4} className="lable">Полное название:</Col>
          <Col span={20} className="info">Общество с ограниченной ответственностью</Col>
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
