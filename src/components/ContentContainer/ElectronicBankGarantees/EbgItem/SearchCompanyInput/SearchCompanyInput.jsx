import React, { PureComponent } from 'react'
import { Row, Col, Form, Input, notification, Button, Affix } from "antd"
import MainCompanyInfo from "./MainCompanyInfo"

const styleCss = {
  suffix: {
    lineHeight: 0
  },
  mainContainer: {
    margin: 0 ,
    padding: "0 1rem",
    height: 55,
    boxShadow: "0 2px 4px #00000033",
    borderRadius: 4
  }
}

class SearchCompanyInput extends PureComponent {
  state = {
    showInfo : false,
    clearField : false,
    collapced: false,
    error: false
  }

  componentDidMount() {
    const { clearField } = this.state
    const { resetFields } = this.props.form
    const { renderData, ebgInn, takeEbgItem } = this.props
    if(!clearField && renderData) {
      this.setState({
        showInfo: true
      })
    }
    if(ebgInn) {
      resetFields()
      this.setState({
        showInfo: false,
        clearField : true
      })
      !renderData && takeEbgItem({inn: ebgInn})
      this.changeValue(ebgInn)
      if(ebgInn && renderData) {
        this.setState({
          showInfo: true,
          clearField : false
        })
      }
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
        loadCompanyInfo(values.data)
        this.changeValue(values.data)
      }
    })
    showInfo && this.clearSearchField()
  }

  changeValue = inn => {
    const { actionChangeInn, ebgInn } = this.props
    if(ebgInn) return actionChangeInn(ebgInn)
    actionChangeInn(inn)
  }

  clearSearchField = () => {
    const { resetFields } = this.props.form
    const { toHideTableInfo, clearCompanyInfo, ebgInn, history } = this.props
    if(ebgInn) {
      clearCompanyInfo()
      history.push(`/electronic-bank-garantees`)
    }
    toHideTableInfo()
    clearCompanyInfo()
    resetFields()
    this.setState({
      showInfo: false,
      clearField : true
    })
  }

  changeSearchValue = value => {
    console.log('change-value', value)
  }

  getFields = () => {
    const { getFieldDecorator } = this.props.form
    const { Search } = Input
    const { showInfo, collapced } = this.state
    const { inn, renderData, ebgInn } = this.props

    return (
      <Row style={{paddingTop: "1rem"}}>
        <Col span={4}>
          <Form.Item style={{marginRight: '1rem', top: -5}}>
            {getFieldDecorator('data', {
              initialValue: ebgInn ? ebgInn : inn,
              rules: [
                { required: true, message: 'Строка поиска не должна быть пустой!' },
                { pattern: '^[0-9]{10,15}$', message: 'Поисковой запрос должен состоять из 10-15 цифр!'}
              ],
            })(
              <Search
                suffix={<span style={styleCss.suffix}/>}
                enterButton={
                  showInfo ? 
                  ebgInn ?  <Button className="search-btn" type="default"> Вернуться в ЭБГ </Button> :
                  <Button className="search-btn" type="default" disabled={!showInfo}> Очистить </Button> : 
                  <Button className="search-btn" type="primary"> Поиск </Button>
                }
                placeholder="Введите ИНН"
                onSearch={this.handleSubmit}
                onPressEnter={this.handleSubmit}
                disabled={true}
              />
            )}
          </Form.Item>
        </Col>
          { renderData && <MainCompanyInfo collapced={collapced}/> }
      </Row>
    )
  }

  openNotification = err => {
    const _errMessage = err => {
      const key = err.time;
      const _close = () => console.log( `Notification was closed. Either the close button was clicked or duration time elapsed.`)
      notification.error({
        message: `Ошибка получения данных`,
        description: err.message,
        duration: 4,
        key,
        onClose: _close,
      });
    }

    if(err.status) return _errMessage(err)
  }

  changeCollapced = value => {
    this.setState({
      collapced: value
    })
  }

  render() {
    const {error, collapced} = this.state
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill -> SearchCompanyInput", пожалуйста перезагрузите страницу</div>
    return (
      <Affix offsetTop={-8} onChange={affixed => this.changeCollapced(affixed)}>
        <Form 
          className="ant-advanced-search-form"
          style={collapced ? styleCss.mainContainer : null}
          onSubmit={this.handleSubmit}
        >
          { this.getFields() }
        </Form>
      </Affix>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'searh-open-bill-company' })(SearchCompanyInput);

export default WrappedRegistrationForm
