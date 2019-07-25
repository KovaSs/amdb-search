import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { Spin, Col, Row, Switch } from "antd";
import PropTypes from "prop-types";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import store from "../../../store"
import { 
  decodedCompanyResponse, 
  decodedRequestLoading, 
  decodedRenderData, 
  decodedErrors, 
  decodedReqnum 
} from "../../../store/ducks/openBill";
import { 
  decodedCompanyResponse as ebgCompanyResponse, 
  decodedRequestLoading as ebgRequestLoading, 
  decodedRenderData as ebgRenderData, 
  decodedErrors as ebgErrors, 
  decodedReqnum as  ebgReqnum
} from "../../../store/ducks/electronicBankGarantees";
import "./open-bill.scss"

class OpenBill extends Component {
  state = {
    showTable : false,
    loading : false,
    newBill: true,
    error: false
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props

    nextProps.requestLoading.get("companyMainInfoUpdate") === true ?
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
    const { companyResponse, ebgInn } = this.props
    companyResponse &&
    this.setState({
      showTable: true
    })
    if(ebgInn) {
      
    }
    document.title = "AC - Проверка | Открытие счета"
  }

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  toggleVersion = () => {
    const { newBill } = this.state;
    this.setState({
      newBill: !newBill
    })
  }

  toHideTableInfo = () => {
    this.setState({
      showTable: false
    })
  }

  render() {
    const { showTable, loading, newBill, error } = this.state
    const { renderData, ebgInn } = this.props
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill", пожалуйста перезагрузите страницу</div>

    const newOpenBill = (
      <Row className="credit-conveyor">
        <Col span={24}>
          <SearchCompanyInput ebgInn={ebgInn} toHideTableInfo={this.toHideTableInfo} />
          { showTable && renderData ?
            <CollapceContainer /> : 
            <Spin spinning={loading} size="large" tip="Идет поиск данных" >
              <div className="search-result-table">
                <div>Открытие счета:</div>
                <div>Для поиска информации об организации введите ИНН в поисковую строку</div>
              </div>
            </Spin>
          }
        </Col>
      </Row>
    )

    return (
      <Suspense fallback={<div></div>}>
        <div className="conveyor-version"><Switch onChange={this.toggleVersion} checkedChildren="new" unCheckedChildren="old" /></div>
        { newBill ?
          newOpenBill :
          <iframe src="https://10.96.205.191/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new2.pl" title="open-bill" width="100%" height="100%"></iframe>
        }
      </Suspense>
    );
  }
}

const putStateToProps = state => {
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      companyResponse : ebgCompanyResponse(state),
      requestLoading: ebgRequestLoading(state) ,
      renderData: ebgRenderData(state),
      errors: ebgErrors(state),
      reqnum: ebgReqnum(state)
    }
  }
  return {
    companyResponse : decodedCompanyResponse(state),
    requestLoading: decodedRequestLoading(state) ,
    renderData: decodedRenderData(state),
    errors: decodedErrors(state),
    reqnum: decodedReqnum(state)
  }
}

OpenBill.propTypes = {
  companyResponse: PropTypes.object,
  requestLoading: PropTypes.object,
  renderData: PropTypes.bool,
  errors: PropTypes.object
}

export default connect(putStateToProps)(OpenBill);


