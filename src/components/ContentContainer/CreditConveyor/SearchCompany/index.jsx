import React, { Component } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionChangeInn, actionChangeOgrn } from "../../../../store/creditConveyor/actions";
import { Row, Col, Form, Input, Button, Select } from "antd";
import "./search-company.scss"


class SearchCompany extends Component {
  state = {
    inn: '',
    ogrn: '',
  };

  handleSubmit = (e) => {
    const { actionChangeInn, actionChangeOgrn } = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {prefix, data} = values;
      if( prefix === 'inn' && data) {
        actionChangeInn(data)
        this.setState(({inn}) => ({
          inn : data,
          ogrn : '',
        }))
      } else if(prefix === 'ogrn'  && data) {
        actionChangeOgrn(data)
        this.setState(({ogrn, inn}) => ({
          ogrn : data,
          inn : '',
        }))
      } else {
        this.setState(({ogrn, inn}) => ({
          ogrn : '',
          inn : '',
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
    return (
      <Col>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
          {this.getFields()}
        </Form>
      </Col>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-company' })(SearchCompany);

const putStateToProps = state => {
  const {creditConveyor : {inn, ogrn}} = state
  return {
    inn,
    ogrn
  }
}
const putActionsToProps = dispatch => {
  return {
    actionChangeInn : bindActionCreators(actionChangeInn, dispatch),
    actionChangeOgrn : bindActionCreators(actionChangeOgrn, dispatch)
  }
}

export default connect(putStateToProps, putActionsToProps)(WrappedRegistrationForm)
