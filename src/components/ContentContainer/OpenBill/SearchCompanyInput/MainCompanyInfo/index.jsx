import React, { Component } from 'react';
import { Col, Row, Badge, Avatar, Icon, Button } from "antd";
import { connect } from "react-redux";
import DrawerContainer from "../../DrawerContainer";
import "./main-organisation-info.scss";

class MainCompanyInfo extends Component {
  state = {
    showRisk: false,
    showHistory: false
  }

  showDrawer = () => {
    this.setState({
      showRisk: true
    });
  };

  onClose = () => {
    this.setState({
      showRisk: false
    });
  };

  render() {
    const { companyResponse, companyResponse: { name, full_name, inn, ogrn, fns, sanctions, isponlit_proizvodstva } } = this.props;
    const { showRisk } = this.state;
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
                <Button onClick={this.showDrawer} title="Факторы риска" style={{ marginRight: "1rem" }}>
                  <Icon type="warning" style={{ color: "#fd0e0efd" }} />
                </Button>
              </Badge>
              <Badge count={0}>
                <Button title="История">
                  <Icon type="file-search" style={{ color: "#0e75fdfd" }} />
                </Button>
              </Badge>
            </Col>
          </Row>
        </Col>
        <DrawerContainer visible={showRisk} onClose={this.onClose} companyResponse={companyResponse}/>
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
