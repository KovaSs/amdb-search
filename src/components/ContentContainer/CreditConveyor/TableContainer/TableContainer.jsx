import React from "react";
import { Row, Col } from "antd";
import "./table-container.scss";
import { TableItem } from "./TableItem";

const TableContainer = props => {
  const { companyResponse } = props.store
  return (
    <div className="table-info">
      <Row>
        <Col span={16}>
          <TableItem props={companyResponse}/>
        </Col>
        <Col span={8}>
        
        </Col>
      </Row>
    </div>
  );
};

export { TableContainer };
