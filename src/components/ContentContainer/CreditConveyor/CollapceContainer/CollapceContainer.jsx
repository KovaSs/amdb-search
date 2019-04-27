import React from "react";
import { Row, Col } from 'antd';
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { companyResponse } = props.store
  return (
    <Row className="table-info">
      <Col span={12}>
        <CollapceItem source={companyResponse}/>
      </Col>
      <Col span={12}>
        <CollapceItem source={companyResponse}/>
      </Col>
    </Row>
  );
};

export { CollapceContainer };
