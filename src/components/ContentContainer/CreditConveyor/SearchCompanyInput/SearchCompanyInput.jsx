import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Select } from "antd";
import "./search-company.scss"

/** get mock data */
import { companyResponse } from "../../../../store/mock";



class SearchCompanyInput extends Component {

  changeValue = () => {
    const { actionChangeInn, actionChangeOgrn } = this.props.store
    setTimeout(() => {
      switch (this.props.form.setFieldsValue.__reactBoundContext.instances.prefix.props.value) {
        case 'inn':
          return actionChangeInn(this.props.form.setFieldsValue.__reactBoundContext.instances.data.state.value) && actionChangeOgrn('')
        case 'ogrn':
          return actionChangeOgrn(this.props.form.setFieldsValue.__reactBoundContext.instances.data.state.value) && actionChangeInn('')
        default:
          break;
      }
    }, 100);
  }
  
  handleSubmit = (e) => {  
    const { loadCompanyInfo } = this.props.store
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setTimeout(() => {
          loadCompanyInfo(companyResponse)
        }, 2000);
        console.log('Полученные значения формы: ', values);
        this.changeValue()
      }
    });
  }

  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'inn',
    })(
      <Select style={{ width: 80 }} >
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
              rules: [
                { required: true, message: 'Строка поиска не должна быть пустой!' },
                { pattern: '^[0-9]+$', message: 'Поисковой запрос должен состоять из цифр!'}
              ],
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
    return (
      <Col>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
          { this.getFields() }
        </Form>
      </Col>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-company' })(SearchCompanyInput);


export default WrappedRegistrationForm
