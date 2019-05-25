import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Select } from "antd";
import MainCompanyInfo from "./MainCompanyInfo";
import "./search-company.scss"

/** Получение данных из mock data */
import { companyResponse } from "../../../../store/mock";



class SearchCompanyInput extends Component {
  state = {
    showInfo : false,
    clearField : false
  }

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

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props.store
    if(nextProps.companyResponse !== companyResponse) {
      this.setState({
        showInfo: true
      })
    }
  }

  componentDidMount() {
    const { companyResponse } = this.props.store
    if(companyResponse) {
      this.setState({
        showInfo: true
      })
    }
  }

  handleSubmit = (e) => {  
    const { loadingCompanyInfo, loadCompanyInfo } = this.props.store
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        loadingCompanyInfo()
        /** Симуляция получения данных от сервера */
        setTimeout(() => {
          loadCompanyInfo(companyResponse)
          this.setState ({
            showInfo: true
          })
        }, 2000);
        // console.log('Полученные значения формы: ', values);
        /** Сохранение данных в state */
        // this.changeValue()
      }
    });
  }

  clearSearchField = () => {
    this.setState({
      showInfo: false,
      clearField: true
    })
  }
  
  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const { showInfo } = this.state
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
        <Col span={6}>
          <Form.Item>
            {getFieldDecorator('data', {
              rules: [
                { required: true, message: 'Строка поиска не должна быть пустой!' },
                { pattern: '^[0-9]+$', message: 'Поисковой запрос должен состоять из цифр!'}
              ],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} disabled={showInfo}/>
            )}
          </Form.Item>
        </Col>
        <Col span={2}>
          { showInfo ?
            <Button onClick={this.clearSearchField} className="search-btn" type="primary"> Очистить </Button>:
            <Button className="search-btn" type="primary" htmlType="submit"> Поиск </Button>
          }
        </Col>
          { 
            showInfo ? <MainCompanyInfo />: null
          }
      </Row>
    )
  }

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
        { this.getFields() }
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-company' })(SearchCompanyInput);


export default WrappedRegistrationForm
