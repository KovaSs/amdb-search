import React from "react";
import { Row, Col } from 'antd';
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { companyResponse : { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, ...companySource}} = props.store
  const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
  // const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
  return (
    <Row className="table-info">
      <Col span={12}>
        <CollapceItem source={companySource}/>
      </Col>
      <Col span={12}>
        <CollapceItem source={managementSource}/>
      </Col>
    </Row>
  );
};

export { CollapceContainer };
