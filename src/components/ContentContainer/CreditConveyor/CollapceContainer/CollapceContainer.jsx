import React from "react";
import { Row, Col } from "antd";
import { CollapceItem } from "./CollapceItem";
import "./table-container.scss";


const CollapceContainer = props => {
  const { companyResponse } = props.store
  return (
    <div className="table-info">
      <Row>
        <Col span={16}>
          <CollapceItem store={companyResponse}/>
        </Col>
        <Col span={8}>
          456
        </Col>
      </Row>
    </div>
  );
};

export { CollapceContainer };
