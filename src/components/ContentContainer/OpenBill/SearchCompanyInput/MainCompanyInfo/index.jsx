import React, { Component } from 'react';
import { Col, Row, Badge, Avatar, Icon, Button } from "antd";
import { connect } from "react-redux";
import toggleDrawer from "../../DrawerContainer";
import RiskInfoDrawer from "../../DrawerContainer/RiskInfoDrawer";
import CompanyHistoryInfoDrawer from "../../DrawerContainer/CompanyHistoryInfoDrawer";
import "./main-organisation-info.scss";

class MainCompanyInfo extends Component {
  // state = {
  //   showRisk: false,
  //   showHistory: false
  // }

  // showDrawer = drawer => {
  //   this.setState({
  //     [drawer]: true
  //   });
  // };

  // onClose = drawer => {
  //   this.setState({
  //     [drawer]: false
  //   });
  // };

  render() {
    const { companyResponse, companyResponse: { name, full_name, inn, ogrn, fns, sanctions, isponlit_proizvodstva } } = this.props;
    // const { showRisk, showHistory } = this.state;
    return (
      <>
        <Col span={20}>
          <Row className="main-info__organisation-info">
            <Col span={1}>
              <Avatar src={process.env.PUBLIC_URL + '/img/logo.png'} />
            </Col>
            <Col span={11}>
              <small className="lable">Полное наименование</small>
              <div className='descr'>{ full_name }</div>
            </Col>
            <Col span={5}>
              <small className="lable">Сокращенное наименование</small>
              <div className='descr'>{ name }</div>
            </Col>
            <Col span={4}>
              <div>
                <small className="lable">ИНН</small>
                <div style={{display : "inline-block"}} className='descr'>{ inn }</div>
              </div>
              <div>
                <small className="lable">ОГРН</small>
                <div style={{display : "inline-block"}} className='descr'>{ ogrn }</div>
              </div>
            </Col>
            <Col span={3} style={{textAlign : "center"}}>
              <Badge count={fns.length + sanctions.length + isponlit_proizvodstva.length} style={{ marginRight: "1rem" }}>
                <Button onClick={() => this.showDrawer('showRisk')} title="Факторы риска" style={{ marginRight: "1rem" }}>
                  <Icon type="warning" style={{ color: "#fd0e0efd" }} />
                </Button>
              </Badge>
              <Badge count={0}>
                <Button onClick={() => this.showDrawer('showHistory')} title="История">
                  <Icon type="file-search" style={{ color: "#0e75fdfd" }} />
                </Button>
              </Badge>
            </Col>
          </Row>
        </Col>
        {toggleDrawer(<RiskInfoDrawer visible={"showRisk"} companyResponse={companyResponse}/>)}
        {toggleDrawer(<CompanyHistoryInfoDrawer visible={"showHistory"} companyResponse={companyResponse}/>)}
        {/* <RiskInfoDrawer visible={showRisk} onClose={() => this.onClose('showRisk')} companyResponse={companyResponse}/>
        <CompanyHistoryInfoDrawer visible={showHistory} onClose={() => this.onClose('showHistory')} companyResponse={companyResponse}/> */}
      </>
    )
  }
}

const putStateToProps = state => {
  const {openBill : { companyResponse }} = state;
  return {
    companyResponse
  }
}

export default connect(putStateToProps)(MainCompanyInfo)
