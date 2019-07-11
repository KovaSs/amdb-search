import React, {useState} from "react";
import { Row, Col, Spin, Collapse, Icon, Button } from 'antd';
import PropTypes from "prop-types";
import MainCompanyData from './MainCompanyData';
import StopListData from './StopListData';
import ManagmentContainer from './ManagmentContainer';
import { trasform } from "../../../../services/utils";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const [addCheckUser, setAddCheckUser] = useState(false)

  const { Panel } = Collapse;
  const {companySource, riskSource, riskSource: {arbiter}, requestLoading  } = props

  /** Преобразование входящих данных из props */
  const fullOrganistionInfo = trasform._companySource(companySource)
  const riskInfo = trasform._riskSource(riskSource)

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  const BtnExtra = ({ user }) => {

    const addUser = e => {
      e.stopPropagation();
      setAddCheckUser(!addCheckUser)
      console.log('add user')
    };

    return (
      <span className="heads-search" style={{width: 40}}>
        <Button
          title="Добавить еще..."
          size="small"
          icon={"user-add"}
          style={{color: "rgba(14, 117, 253, 0.992)"}}
          onClick={e => addUser(e)}
        />
      </span>
    )
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
                <MainCompanyData loading={false} fields={fullOrganistionInfo}/>
                <StopListData  riskInfo={riskInfo} arbiter={arbiter}/>
              </Panel>
              <Panel 
                key="2" 
                className="table-info-panel"
                header="Связанные лица" 
                forceRender
                extra={<BtnExtra />}
              >
                { addCheckUser && <ManagmentContainer addUser={true} onSave={setAddCheckUser}/> }
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
    arbiter: PropTypes.object
  }),
}