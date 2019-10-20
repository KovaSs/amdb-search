import React, { Component, Suspense } from "react"
import { connect } from "react-redux"
import { Spin, Col, Row } from "antd"
import PropTypes from "prop-types"
import CollapceContainer from "./CollapceContainer"
import SearchCompanyInput from "./SearchCompanyInput"
import { 
  decodedCompanyResponse, 
  decodedRequestLoading, 
  decodedRenderData,
  decodedEbgMainResponse,
  decodedErrors, 
  decodedReqnum 
} from "../../../../store/ducks/EBG"

class EbgItem extends Component {
  state = {
    showTable : false,
    error: false
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props

    nextProps.requestLoading.get("companyMainInfoUpdate") === true &&
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
    document.title = "AC - Проверка | Открытие счета"
  }

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  toHideTableInfo = () => {
    this.setState({
      showTable: false
    })
  }

  render() {
    const { showTable, error } = this.state
    const { renderData, ebgInn, requestLoading, companyResponse } = this.props
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "Кредитного конвеера", пожалуйста перезагрузите страницу</div>

    const renderDataComponent = (
      <Row className="credit-conveyor">
        <Col span={24}>
          <SearchCompanyInput ebgInn={ebgInn} toHideTableInfo={this.toHideTableInfo} />
          { showTable && renderData ?
            <CollapceContainer mainKey={companyResponse.key}/> : 
            <Spin spinning={requestLoading.get("companyMainInfoUpdate")} size="large" tip="Идет поиск данных" >
              <div className="search-result-table" style={{display: "table"}}>
                <div style={{display: "table-cell", verticalAlign: "middle"}}>
                  <div style={{marginLeft: "auto", marginRight: "auto"}}>
                    <div>Электронные банковские гарантии:</div>
                    <div>Ведется поиск интересующей Вас информации об организации, пожалуйста подождите</div>
                  </div>
                </div>
              </div>
            </Spin>
          }
        </Col>
      </Row>
    )

    return (
      <Suspense fallback={<div></div>}>
        { renderDataComponent }
      </Suspense>
    );
  }
}

const putStateToProps = state => {
  return {
    companyResponse: decodedCompanyResponse(state),
    requestLoading: decodedRequestLoading(state) ,
    renderData: decodedRenderData(state),
    errors: decodedErrors(state),
    reqnum: decodedReqnum(state),
    ebgData: decodedEbgMainResponse(state)
  }
}

export default connect(putStateToProps)(EbgItem)

/** Проверка на входящие параметры */
EbgItem.propTypes = {
  companyResponse: PropTypes.object,
  requestLoading: PropTypes.object,
  renderData: PropTypes.bool,
  errors: PropTypes.object
}