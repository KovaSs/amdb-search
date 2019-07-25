import React, { PureComponent } from 'react'
import { Row, Col, Form, Input, notification, Button } from "antd"
import MainCompanyInfo from "./MainCompanyInfo"

class SearchCompanyInput extends PureComponent {
  state = {
    showInfo : false,
    clearField : false,
    error: false
  }

  componentDidMount() {
    const { clearField } = this.state
    const { resetFields } = this.props.form
    const { renderData, ebgInn, loadCompanyInfo, toHideTableInfo, clearCompanyInfo } = this.props
    if(!clearField && renderData) {
      this.setState({
        showInfo: true
      })
    }
    if(ebgInn) {
      toHideTableInfo()
      clearCompanyInfo()
      resetFields()
      this.setState({
        showInfo: false,
        clearField : true
      })
      loadCompanyInfo(ebgInn)
      this.changeValue(ebgInn)
    }
  }

  componentDidUpdate(prevProps) {
    const { companyResponse, renderData, errors } = this.props
    if(companyResponse !== prevProps.companyResponse && renderData) {
      this.setState({
        showInfo: true,
        clearField : false
      })
    }
    if(errors && errors !== prevProps.errors && errors.status) this.openNotification(errors)
  }

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }
  
  handleSubmit = e => {  
    const { loadCompanyInfo } = this.props
    const { showInfo } = this.state
    if(typeof e === 'function' || typeof e === 'object') {
      e.preventDefault();
    }

    !showInfo && this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values.data', loadCompanyInfo)
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
    const { toHideTableInfo, clearCompanyInfo, ebgInn } = this.props
    if(ebgInn) {
      
    }
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
                allowClear={!showInfo}
              />
            )}
          </Form.Item>
        </Col>
          { renderData && <MainCompanyInfo /> }
      </Row>
    )
  }

  openNotification = err => {
    const _errMessage = err => {
      const key = err.time;
      // const confirmBtn = (
      //   <Button type="primary" size="small" onClick={() => notification.close(key)}>
      //     Повторить запрос
      //   </Button>
      // );
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      notification['error']({
        message: `Ошибка получения данных`,
        description: err.message,
        // confirmBtn,
        duration: 4,
        // btn: confirmBtn,
        key,
        onClose: _close,
      });
    }

    if(err.status) return _errMessage(err)

  };

  render() {
    const {error} = this.state
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill -> SearchCompanyInput", пожалуйста перезагрузите страницу</div>
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
        { this.getFields() }
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-open-bill-company' })(SearchCompanyInput);


export default WrappedRegistrationForm
