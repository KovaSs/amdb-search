import React from "react";
import { Row, Col, Spin, Collapse, Icon } from 'antd';
import PropTypes from "prop-types";
import MainCompanyData from './MainCompanyData';
import StopListData from './StopListData';
import ManagmentContainer from './ManagmentContainer';
import { trasform } from "../../../../services/transformData";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { Panel } = Collapse;
  const {companySource, riskSource, riskSource: {arbiter}, requestLoading  } = props

  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  const riskInfo = trasform._riskSource(riskSource)

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  return (
    <Row className="table-info">
      <Col span={24}>
        <Spin spinning={requestLoading.get("companyMainInfo")} size="large" tip="Идет поиск данных" >
          { companySource &&
            <Collapse 
              defaultActiveKey={['1', '2', '3', '4']} 
              onChange={callback}
              expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
            >
              <Panel header="Общая информация" key="1" showArrow={false}>
                <MainCompanyData loading={requestLoading.get("companyPCUpdate")} fields={fullOrganistionInfo}/>
                <StopListData  riskInfo={riskInfo} arbiter={arbiter}/>
              </Panel>
              <Panel header="Связанные лица" key="2" forceRender className="table-info-panel">
                <ManagmentContainer />
              </Panel>
            </Collapse>
          }
        </Spin>
      </Col>
    </Row>
  );
};

export { CollapceContainer };

CollapceContainer.propTypes = {
  /** Данные о состоянии loaders */
  requestLoading: PropTypes.shape({
    companyMainInfo: PropTypes.bool, 
    companyMainInfoUpdate: PropTypes.bool, 
    companyPCUpdate: PropTypes.bool
  }),
  /** Данные о кампании */
  companySource: PropTypes.object,
  /** Данные о риск факторах */
  riskSource: PropTypes.shape({
    isponlit_proizvodstva: PropTypes.array,
    sanctions: PropTypes.array,
    fns: PropTypes.array,
    arbiter: PropTypes.object
  }),
}