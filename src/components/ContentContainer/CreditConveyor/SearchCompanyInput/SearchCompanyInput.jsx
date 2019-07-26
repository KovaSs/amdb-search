import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, notification } from "antd";
import MainCompanyInfo from "./MainCompanyInfo";
import "./search-company.scss"

class SearchCompanyInput extends Component {
  state = {
    showInfo : false,
    clearField : false
  }

  componentDidMount() {
    const { clearField } = this.state
    const { renderData } = this.props
    if(!clearField && renderData) {
      this.setState({
        showInfo: true
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { companyResponse, renderData } = this.props
    if(companyResponse !== prevProps.companyResponse && renderData) {
      this.setState({
        showInfo: true,
        clearField : false
      })
    }

    prevProps.errors.companyMainInfo && this.openNotification('companyMainInfo')
    prevProps.errors.companyMainInfoUpdate && this.openNotification('companyMainInfoUpdate')
    prevProps.errors.companyPCUpdate && this.openNotification('companyPCUpdate')
  }
  
  handleSubmit = e => {  
    const { loadCompanyInfo } = this.props
    const { showInfo } = this.state
    if(typeof e === 'function' || typeof e === 'object') {
      e.preventDefault();
    }

    // const api = { 
    //     type: 'get_company_ps',
    //     reqnum: 1,
    //     data : {
    //       code: this.props.form.setFieldsValue.__reactBoundContext.instances.data.props.value
    //     }
    //   }
  
    //   fetch(`/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl?request=${JSON.stringify(api)}`, {
    //     mode: 'cors',
    //     credentials: 'include',
    //   })
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log('res | PC', res)
    //     console.log('res | PC', JSON.parse(res.data))
    //   })
    //   .catch(err => console.log('err', err))

    !showInfo && this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        loadCompanyInfo(values.data)
        this.changeValue(values.data)
      }
    })
    showInfo && this.clearSearchField()
  }

  changeValue = inn => {
    const { actionChangeInn } = this.props
    actionChangeInn(inn)
  }

  clearSearchField = () => {
    const { resetFields } = this.props.form
    const { toHideTableInfo, clearCompanyInfo } = this.props
    toHideTableInfo()
    clearCompanyInfo()
    resetFields()
    this.setState({
      showInfo: false,
      clearField : true
    })
  }

  getFields = () => {
    const { getFieldDecorator } = this.props.form
    const { Search } = Input
    const { showInfo } = this.state
    const { inn, renderData } = this.props
    return (
      <Row>
        <Col span={4}>
          <Form.Item style={{marginRight: '1rem'}}>
            {getFieldDecorator('data', {
              initialValue: inn,
              rules: [
                { required: true, message: 'Строка поиска не должна быть пустой!' },
                { pattern: '^[0-9]{10,15}$', message: 'Поисковой запрос должен состоять из 10-15 цифр!'}
              ],
            })(
              <Search 
                placeholder="Введите ИНН"
                enterButton={
                  showInfo ? 
                  <Button className="search-btn" type="default" disabled={!showInfo}> Очистить </Button> : 
                  <Button className="search-btn" type="primary"> Поиск </Button>
                }
                onSearch={this.handleSubmit}
                onPressEnter={this.handleSubmit}
                option={{ initialValue : inn }}
                disabled={showInfo}
              />
            )}
          </Form.Item>
        </Col>
          { renderData && <MainCompanyInfo /> }
      </Row>
    )
  }

  openNotification = err => {
    const close = () => console.log( `Notification ${err} was closed. Either the close button was clicked or duration time elapsed.`)

    const key = err;
    const confirmBtn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        Повторить запрос
      </Button>
    );
    notification.error({
      message: `Ошибка получения данных`,
      description: `Произошла ошибка при выполнении запроса ${err}`,
      confirmBtn,
      duration: 4,
      // btn: confirmBtn,
      key,
      onClose: close,
    });
  };

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
        { this.getFields() }
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-credit-conveyor-company' })(SearchCompanyInput);


export default WrappedRegistrationForm
