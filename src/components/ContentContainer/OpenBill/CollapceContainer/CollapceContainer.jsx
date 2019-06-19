import React from "react";
import { Row, Col, Spin } from 'antd';
import PropTypes from "prop-types";
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { loading } = props
  return (
    <Row className="table-info">
      <Col span={24}>
        <Spin spinning={loading} size="large" tip="Идет поиск данных" >
          <CollapceItem {...props} />
        </Spin>
      </Col>
    </Row>
  );
};

export { CollapceContainer };

CollapceContainer.propTypes = {
  loading: PropTypes.bool,
  companySource: PropTypes.object,
  managementSource: PropTypes.shape({
    heads: PropTypes.array,
    management_companies: PropTypes.array,
    founders_fl: PropTypes.array,
    founders_ul: PropTypes.array,
    befenicials: PropTypes.array
  }),
  riskSource: PropTypes.shape({
    isponlit_proizvodstva: PropTypes.array,
    sanctions: PropTypes.array,
    fns: PropTypes.array,
    arbiter: PropTypes.object
  }),
}