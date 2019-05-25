import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin, Col, Row, Switch } from "antd";
import CollapceContainer from "./CollapceContainer";
import SearchCompanyInput from "./SearchCompanyInput";
import DrawerContainer from "./DrawerContainer";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    /** propdaction => showTable : false */
    showTable : false,
    loading : false,
    newConveyor: true
  }  

  componentWillReceiveProps(nextProps) {
    const { companyResponse } = this.props
    if(nextProps.searchLoading === true) {
      this.setState({
        loading: true
      })
    } else {
      this.setState({
        loading: false
      })
    }
    if(nextProps.companyResponse !== companyResponse) {
      this.setState({
        showTable: true
      })
    }
  }

  componentDidMount() {
    const { companyResponse } = this.props
    if(companyResponse) {
      this.setState({
        showTable: true
      })
    }
  }

  toggleVersion = () => {
    const { newConveyor } = this.state;
    this.setState({
      newConveyor: !newConveyor
    })
  }

  render() {
    const { showTable, loading, newConveyor } = this.state

    const newCreditConveyor = (
      <Row className="credit-conveyor">
        <Col span={24}>
          <SearchCompanyInput />
          { showTable ?
            <CollapceContainer /> : 
            <div className="search-result-table">
              { loading ?
                <Spin size="large" /> :
                <div>Для поиска информации об организации введите ИНН или ОГРН в поисковую строку</div>
              }
            </div>
          }
        </Col>
        <Col span={7}>
          {
            showTable ?
            <div className="credit-conveyor__risk-factor">
              <DrawerContainer />
            </div> : null
          }
        </Col>
      </Row>
    )

    return (
      <>
        <div className="conveyor-version"><Switch onChange={this.toggleVersion} /></div>
        { newConveyor ?
          newCreditConveyor :
          <iframe src="https://10.96.205.191/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new2.pl" title="credit-conveyor" width="100%" height="900px"></iframe>
        }
      </>
    );
  }
}

const putStateToProps = state => {
  const {creditConveyor : { companyResponse, searchLoading }} = state
  return {
    companyResponse,
    searchLoading
  }
}

export default connect(putStateToProps)(CreditConveyor);
