import React from "react";
import { Row, Col, Spin } from 'antd';
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { requestLoading : {companyMainInfo} } = props
  return (
    <Row className="table-info">
      <Col span={24}>
        <Spin spinning={companyMainInfo} size="large" tip="Идет поиск данных" >
          <CollapceItem {...props}/>
        </Spin>
      </Col>
    </Row>
  );
};

export { CollapceContainer };
