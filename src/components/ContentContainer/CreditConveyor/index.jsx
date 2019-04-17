import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Select } from "antd";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    inn: '',
    ogrn: ''
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
        console.log('Полученные значения формы: ', values);
      }
    });
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
    // console.log(`state`, this.state)
    return (
      <div className="credit-conveyor">
        <Col style={{ backgroundColor: "rgba(43, 255, 0, 0.24)" }}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
            {this.getFields()}
          </Form>
        </Col>
        <Col>
          <div className="search-result-table">Search Result Table</div>
        </Col>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-company' })(CreditConveyor);


export default WrappedRegistrationForm;
