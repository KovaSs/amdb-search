import React from 'react';
import { Col, Row } from "antd";
import { connect } from "react-redux";

const MainCompanyInfo = props => {
  const { name, full_name} = props.companyResponse

  return (
    <>
      <Col span={16}>
        <Row className="main-info__organisation-info">
          <Col span={8} className="lable">Полное наименование</Col>
          <Col span={16} className='descr'>{ full_name }</Col>
        </Row>
        <Row className="main-info__organisation-info">
          <Col span={8} className="lable">Сокращенное наименование</Col>
          <Col span={16} className='descr'>{ name }</Col>
        </Row>
      </Col>
    </>
  )
}

const putStateToProps = state => {
  const {creditConveyor : { companyResponse }} = state
  return {
    companyResponse
  }
}

export default connect(putStateToProps)(MainCompanyInfo)
