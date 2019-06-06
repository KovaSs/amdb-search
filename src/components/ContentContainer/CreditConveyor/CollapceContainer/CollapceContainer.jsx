import React from "react";
import { Row, Col, Spin } from 'antd';
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  /** Сортировка полученных данных по категориям */
  const { companyResponse : { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, sanctions, isponlit_proizvodstva, ...companySource}} = props.store
  const { loading } = props.store
  const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
  const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
  return (
    <Row className="table-info">
      <Col span={24}>
        <Spin spinning={loading} size="large" tip="Идет поиск данных" >
          <CollapceItem companySource={companySource} riskSource={riskSource} managementSource={managementSource}/>
        </Spin>
      </Col>
    </Row>
  );
};

export { CollapceContainer };
