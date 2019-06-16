import React, { Component } from 'react'
import { Row, Col, Form, Input, Button} from "antd"
import MainCompanyInfo from "./MainCompanyInfo"
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
    const { companyResponse } = this.props
    if(companyResponse !== prevProps.companyResponse) {
      this.setState({
        showInfo: true,
        clearField : false
      })
    }
  }
  
  handleSubmit = e => {  
    const { loadCompanyOpenBillInfo } = this.props
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
        loadCompanyOpenBillInfo(this.props.form.setFieldsValue.__reactBoundContext.instances.data.props.value)
        this.changeValue()
      }
    })
    showInfo && this.clearSearchField()
  }

  changeValue = () => {
    const { actionChangeOpenBillInn } = this.props
    setTimeout(() => {
      actionChangeOpenBillInn(this.props.form.setFieldsValue.__reactBoundContext.instances.data.props.value)
    }, 100);
  }

  clearSearchField = () => {
    const { resetFields } = this.props.form
    const { toHideTableInfo, clearCompanyOpenBillInfo } = this.props
    toHideTableInfo()
    clearCompanyOpenBillInfo()
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
                placeholder="Введите ИНН или ОГРН"
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
        {/* <Col span={2}>
          { showInfo ?
            <Button onClick={this.clearSearchField} className="search-btn" type="default"> Очистить </Button> :
            <Button className="search-btn" type="primary" htmlType="submit"> Поиск </Button>
          }
        </Col> */}
          { renderData && <MainCompanyInfo /> }
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

const WrappedRegistrationForm = Form.create({ name: 'searh-open-bill-company' })(SearchCompanyInput);


export default WrappedRegistrationForm
