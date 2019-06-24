import React from "react";
import { Row, Col, Spin } from 'antd';
import PropTypes from "prop-types";
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { requestLoading : {companyMainInfo} } = props
  return (
    <Row className="table-info">
      <Col span={24}>
        <Spin spinning={companyMainInfo} size="large" tip="Идет поиск данных" >
          <CollapceItem {...props} />
        </Spin>
      </Col>
    </Row>
  );
};

export { CollapceContainer };

CollapceContainer.propTypes = {
  requestLoading: PropTypes.shape({
    companyMainInfo: PropTypes.bool, 
    companyMainInfoUpdate: PropTypes.bool, 
    companyPCUpdate: PropTypes.bool
  }),
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