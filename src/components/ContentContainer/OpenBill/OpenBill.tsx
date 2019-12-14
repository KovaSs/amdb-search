import React from "react";
import { connect } from "react-redux";
import { Spin, Col, Row } from "antd";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import { sl } from "../../../store/ducks/openBill";

interface OwnProps {
  ebgInn: string;
}

interface StateProps {
  // TODO add types
  reqnum: any;
  companyResponse: any;
  requestLoading: any;
  renderData: any;
  errors: any;
}

type Props = OwnProps & StateProps

class OpenBill extends React.Component<Props> {
  state = {
    showTable : false,
    loading : false,
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
    const { showTable, loading, error } = this.state
    const { renderData, ebgInn } = this.props
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill", пожалуйста перезагрузите страницу</div>

    return (
      <React.Suspense fallback={<div></div>}>
        <Row className="credit-conveyor">
          <Col span={24}>
            <SearchCompanyInput ebgInn={ebgInn} toHideTableInfo={this.toHideTableInfo} />
            { showTable && renderData ?
              <CollapceContainer /> : 
              <Spin spinning={loading} size="large" tip="Идет поиск данных" >
                <div className="search-result-table" style={{display: "table"}}>
                  <div style={{display: "table-cell", verticalAlign: "middle"}}>
                    <div style={{marginLeft: "auto", marginRight: "auto"}}>
                      <div>Открытие счета:</div>
                      <div>Для поиска информации об организации введите ИНН в поисковую строку</div>
                    </div>
                  </div>
                </div>
              </Spin>
            }
          </Col>
        </Row>
      </React.Suspense>
    );
  }
}

const putStateToProps = state => {
  return {
    companyResponse: sl.decodedCompanyResponse(state),
    requestLoading: sl.decodedRequestLoading(state),
    renderData: sl.decodedRenderData(state),
    errors: sl.decodedErrors(state),
    reqnum: sl.decodedReqnum(state)
  }
}

export default connect(putStateToProps)(OpenBill)