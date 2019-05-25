import React from 'react';
import { Col, Row, Badge, Avatar, Icon, Button } from "antd";
import { connect } from "react-redux";
import "./main-organisation-info.scss";

const MainCompanyInfo = props => {
  const { name, full_name, inn, ogrn} = props.companyResponse

  return (
    <>
      <Col span={16} >
        <Row className="main-info__organisation-info">
          <Col span={1}>
            <Badge count={2}><Avatar src={process.env.PUBLIC_URL + 'img/logo.png'} /></Badge>
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
            <small className="lable">ИНН</small>
            <div style={{display : "inline-block"}} className='descr'>{ inn }</div>
            <small className="lable">ОГРН</small>
            <div style={{display : "inline-block", textAlign: "left"}} className='descr'>{ ogrn }</div>
          </Col>
          <Col span={3} style={{textAlign : "center"}}>
            <Button title="Факторы риска"><Icon type="warning" theme="twoTone" twoToneColor="#fd0e0efd" /></Button>
            <Button title="История"><Icon type="folder-open" theme="twoTone" twoToneColor="#0e75fdfd" /></Button>
            
          </Col>
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
