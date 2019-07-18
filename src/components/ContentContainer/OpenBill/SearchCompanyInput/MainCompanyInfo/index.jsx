import React, { Component } from 'react';
import { Col, Row, Badge, Avatar, Button } from "antd";
import { connect } from "react-redux";
import RiskInfoDrawer from "../../DrawerContainer/RiskInfoDrawer";
import CompanyHistoryInfoDrawer from "../../DrawerContainer/CompanyHistoryInfoDrawer";
import { 
  decodedCompanyResponse, 
  decodedisIp, 
  decodedDigetsList, 
  addRiskFactor, 
  deleteRiskFactor, 
  decodedRequestLoading 
} from "../../../../../store/ducks/openBill";
import "./main-organisation-info.scss";

class MainCompanyInfo extends Component {
  state = {
    showRisk: false,
    showHistory: false,
    error: false
  }

  showDrawer = drawer => {
    this.setState({
      [drawer]: new Date()
    });
  };

  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  renderNotIpInfo = () => {
    const { companyResponse: { name, full_name, inn, ogrn } } = this.props;
    return (
      <>
        <Col span={1}>
          <Avatar src={process.env.PUBLIC_URL + '/img/logo.png'} />
        </Col>
        <Col span={11}>
          <small className="lable">Полное наименование</small>
          <div className='descr'>{ full_name }</div>
        </Col>
        <Col span={5}>
          <small className="lable">Сокращенное наименование</small>
          <div className='descr'>{ name }</div>
        </Col>
        <Col span={4}>
          <div style={{display : "inline-block"}}>
            <small className="lable">ИНН</small>
            <div style={{display : "inline-block"}} className='descr'>{ inn }</div>
          </div>
          <div style={{display : "inline-block"}}>
            <small className="lable">ОГРН</small>
            <div style={{display : "inline-block"}} className='descr'>{ ogrn }</div>
          </div>
        </Col>
      </>
    )
  }

  renderIpInfo = () => {
    const { companyResponse: { full_name, inn, ogrn } } = this.props;
    return (
      <>
        <Col span={1}>
          <Avatar src={process.env.PUBLIC_URL + '/img/logo.png'} />
        </Col>
        <Col span={11} style={{display : "inline-block", marginTop: ".5rem"}}>
          <small className="lable">Полное наименование</small>
          <label className='descr'>{ full_name }</label>
        </Col>
        <Col span={9}>
          <div style={{display : "inline-block", marginTop: ".5rem"}}>
            <small className="lable" style={{padding: ".5rem"}}>ИНН</small>
            <label style={{display : "inline-block"}} className='descr'>{ inn }</label>
          </div>
          <div style={{display : "inline-block"}}>
            <small className="lable" style={{padding: ".5rem"}}>ОГРН</small>
            <label style={{display : "inline-block"}} className='descr'>{ ogrn }</label>
          </div>
        </Col>
      </>
    )
  }

  render() {
    const { 
      companyResponse,
      requestLoading,
      digets, 
      addRiskFactor, 
      deleteRiskFactor, 
      companyResponse: { fns, sanctions, isponlit_proizvodstva, leaders_list, name }, 
      isIp 
    } = this.props;
    const { showRisk, showHistory, error } = this.state
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "openBill -> SearchCompanyInput -> mainCompanyInfo", пожалуйста перезагрузите страницу</div>
    return (
      <>
        <Col span={20}>
          <Row className="main-info__organisation-info">
            { isIp ? this.renderIpInfo() : this.renderNotIpInfo() }
            <Col span={3} style={{textAlign : "center", minHeight: "1rem"}}>
              <div className="show-btn-drawer-count">
                  <Button 
                    size="small" 
                    icon="ie" 
                    href={`https://www.google.com/search?hl=ru&as_oq=отзывы+криминал+компромат+обыск+уголовное+мошенник+обнал+откат+взятка+жулик+нарушения+претензии+конфликт+подан-иск+преследование+расследование+разбирательство+следствие+прокуратура+МВД+ФСБ+полиция+хищение+отмывание&as_q=${name}`}
                    target="_blank"
                    title="Поиск негативной информации в интернетe" 
                    style={{color: "#52c41a", marginRight: ".5rem"}}
                  />
                <Badge 
                  count={fns.length + sanctions.length + isponlit_proizvodstva.length} 
                  offset={[-10, 0]} 
                  overflowCount={99}
                >
                  <Button 
                    size="small" 
                    icon="warning" 
                    title="Факторы риска" 
                    style={{color: "#fd0e0efd", marginRight: ".5rem"}}
                    onClick={() => this.showDrawer('showRisk')} 
                  />
                </Badge>
                { !isIp &&
                  <Badge 
                    count={leaders_list.length} 
                    style={{backgroundColor : "#52c41a"}} 
                    overflowCount={99}
                  >
                    <Button 
                      size="small" 
                      icon="file-search" 
                      title="История" 
                      style={{color: "#0e75fdfd"}} 
                      onClick={() => this.showDrawer('showHistory')}
                    />
                  </Badge>
                }
              </div>
            </Col>
          </Row>
        </Col>
        <RiskInfoDrawer 
          addRiskFactor={addRiskFactor} 
          deleteRiskFactor={deleteRiskFactor} 
          digets={digets}
          requestLoading={requestLoading}
          toggleDrawer={showRisk} 
          companyResponse={companyResponse}
        /> 
        {!isIp && <CompanyHistoryInfoDrawer toggleDrawer={showHistory} headHistory={leaders_list}/>}
      </>
    )
  }
}

const putStateToProps = state => {
  return {
    isIp: decodedisIp(state),
    requestLoading: decodedRequestLoading(state),
    companyResponse: decodedCompanyResponse(state),
    digets: decodedDigetsList(state)
  }
}
const putActionToProps = {
  addRiskFactor,
  deleteRiskFactor
}

export default connect(putStateToProps, putActionToProps)(MainCompanyInfo)
