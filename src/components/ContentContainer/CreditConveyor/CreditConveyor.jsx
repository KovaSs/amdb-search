import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin, Col, Row, Switch } from "antd";
import { sl } from "../../../store/ducks/creditConveyor";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import config from "../../../config";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    showTable : false,
    loading : false,
    newConveyor: true
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props

    nextProps.requestLoading.companyMainInfoUpdate === true ?
      this.setState({
        loading: true
      }) :
      this.setState({
        loading: false,
        showTable: true
      })
    nextProps.companyResponse !== companyResponse && 
    this.setState({ 
      showTable: true 
    })
  }

  componentDidMount() {
    const { companyResponse } = this.props
    companyResponse &&
    this.setState({
      showTable: true
    })
    document.title = "AC - Проверка | Кредитный конвеер"
  }

  toggleVersion = () => {
    const { newConveyor } = this.state;
    this.setState({
      newConveyor: !newConveyor
    })
  }

  toHideTableInfo = () => {
    this.setState({
      showTable: false
    })
  }

  /** Рендеринг информации о компании */
  get renderCreditConveyor() {
    const { showTable, loading } = this.state
    const { renderData } = this.props
    return (
      <Row className="credit-conveyor">
        <Col span={24}>
          <SearchCompanyInput toHideTableInfo={this.toHideTableInfo} />
          { showTable && renderData ?
            <CollapceContainer /> : 
            <Spin spinning={loading} size="large" tip="Идет поиск данных">
              <div className="search-result-table">
                <div>Кредитный конвеер:</div>
                <div>Для поиска информации об организации введите ИНН в поисковую строку</div>
              </div>
            </Spin>
          }
        </Col>
      </Row>
    )
  }

  render() {
    const { newConveyor } = this.state
    return (
      <>
        <div className="conveyor-version"><Switch onChange={this.toggleVersion} checkedChildren="new" unCheckedChildren="old" /></div>
        { newConveyor ?
          this.renderCreditConveyor :
          <iframe src={`${config.api()}/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new4.pl`} title="credit-conveyor" width="100%" height="100%"></iframe>
        }
      </>
    )
  }
}

const putStateToProps = state => {
  return {
    companyResponse: sl.decodedCompanyResponse(state),
    requestLoading: sl.decodedRequestLoading(state),
    renderData: sl.decodedRenderData(state),
    errors: sl.decodedErrors(state)
  }
}

export default connect(putStateToProps)(CreditConveyor);