import React, { Component } from 'react'
import { Col, Row, Badge, Avatar, Button, message } from "antd"
import { connect } from "react-redux";
import RiskInfoDrawer from "../../DrawerContainer/RiskInfoDrawer"
import CompanyHistoryInfoDrawer from "../../DrawerContainer/CompanyHistoryInfoDrawer"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { 
  decodedCompanyResponse,
  decodedManagementSource,
  decodedisIp, 
  storeMainDigest,
  addNewUserToCheackList,
} from "../../../../../store/ducks/openBill"

const styleCss = {
  internetBtn : {
    color: "#0e75fdfd",
    marginRight: ".5rem"
  },
  companyHistory : {
    backgroundColor : "#52c41a"
  },
  bange: {
    backgroundColor: "rgb(255, 241, 240)",
    color: "#f5222d",
    boxShadow: "0 0 0 1px #ffa39e inset"
  },
  avatar: {
    margin: "2px 2px 2px 5px",
    fontSize: 11,
    width: 25,
    height: 25,
    lineHeight: "25px"
  },
  btnContainer: {
    margin: 3
  },
  mainInfoContainer: {
    padding: 0,
    margin: 0,
    height: 30
  },
  mainDescr: {
    marginTop: 3
  }
}

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
    const { companyResponse: { name, full_name, inn, ogrn }, collapced } = this.props;
    return (
      <>
        <Col span={1}>
          <Avatar style={collapced ? styleCss.avatar : null}>ЮЛ</Avatar>
        </Col>
        <Col span={20}>
          <div style={collapced ? {opacity: 0, height: 0, display: "none"} : null}>
            <small className="lable">Полное наименование</small>
            <label className='descr'>{ full_name }</label>
          </div>
          <div style={collapced ? styleCss.mainDescr : null}>
            <small className="lable">Сокращенное наименование</small>
            <label className='descr'>{ name }</label>
            <small className="lable">ИНН</small>
            <CopyToClipboard key="copy-inn" title="Скопировать" text={inn} onCopy={() => message.success(`${inn} - скопировано!`, 1)}>
              <label style={{display : "inline-block", marginRight: 10, cursor: "pointer"}} className='descr'>{ inn }</label>
            </CopyToClipboard>
            <small className="lable">ОГРН</small>
            <CopyToClipboard key="copy-ogrn" title="Скопировать" text={ogrn} onCopy={() => message.success(`${ogrn} - скопировано!`, 1)}>
              <label style={{display : "inline-block", cursor: "pointer"}} className='descr'>{ ogrn }</label>
            </CopyToClipboard>
          </div>
        </Col>
      </>
    )
  }

  renderIpInfo = () => {
    const {
      collapced,
      companyResponse: { 
        full_name, 
        inn, 
        ogrn, 
        sex = "", 
        birthdate, 
        birth_place 
      } 
    } = this.props;
    return (
      <>
        <Col span={1}>
          <Avatar style={collapced ? styleCss.avatar : null}> ИП </Avatar>
        </Col>
        <Col span={20}>
          <div style={collapced ? styleCss.mainDescr : null}>
            <small className="lable"> ФИО </small>
            <label className='descr'> { full_name } </label>
            <small className="lable"> ИНН </small>
            <CopyToClipboard key="copy-inn" title="Скопировать" text={inn} onCopy={() => message.success(`${inn} - скопировано!`, 1)}>
              <label style={{display : "inline-block", marginRight: 10, cursor: "pointer"}} className='descr'>{ inn }</label>
            </CopyToClipboard>
            <small className="lable"> ОГРН </small>
            <CopyToClipboard key="copy-ogrn" title="Скопировать" text={ogrn} onCopy={() => message.success(`${ogrn} - скопировано!`, 1)}>
              <label style={{display : "inline-block", cursor: "pointer"}} className='descr'>{ ogrn }</label>
            </CopyToClipboard>
          </div>
          <div style={collapced ? {opacity: 0, height: 0, display: "none"} : null}>
            <small className="lable"> Пол </small>
            <label className='descr'> { sex ? sex : "—" } </label>
            <small className="lable"> Дата рождения </small>
            <label className='descr'> { birthdate ? birthdate : "—" } </label>
            <small className="lable"> Место рождения </small>
            <label className='descr'> { birth_place ? birth_place :  "—" } </label>
          </div>
        </Col>
      </>
    )
  }

  render() {
    const {
      collapced,
      digets,
      companyResponse: { management_history, name, full_name }, 
      isIp,
      addNewUserToCheackList,
      heads
    } = this.props;
    const { showRisk, showHistory, error } = this.state
    if(error) return <div style={{textAlign: "center"}}>Ошибка в работе компонента "Открытие счета -> Информация о компании", пожалуйста перезагрузите страницу</div>
    return (
      <>
        <Col span={20}>
          <Row className="main-info__organisation-info" style={collapced ? styleCss.mainInfoContainer : null}>
            { isIp ? this.renderIpInfo() : this.renderNotIpInfo() }
            <Col span={3} style={{textAlign : "center", minHeight: "1rem"}}>
              <div className="show-btn-drawer-count" style={collapced ? styleCss.btnContainer : null}>
                <CopyToClipboard 
                  key="search-word-1" 
                  title="Поиск негативной информации в интернетe"
                  style={styleCss.internetBtn} 
                  text={ isIp ?
                    `https://www.google.com/search?hl=ru&as_oq=отзывы+криминал+компромат+обыск+уголовное+мошенник+обнал+откат+взятка+жулик+нарушения+претензии+конфликт+подан-иск+преследование+расследование+разбирательство+следствие+прокуратура+МВД+ФСБ+полиция+хищение+отмывание&as_q=${full_name}` :
                    `https://www.google.com/search?hl=ru&as_oq=отзывы+криминал+компромат+обыск+уголовное+мошенник+обнал+откат+взятка+жулик+нарушения+претензии+конфликт+подан-иск+преследование+расследование+разбирательство+следствие+прокуратура+МВД+ФСБ+полиция+хищение+отмывание&as_q=${name}`
                  }
                  onCopy={() => message.success(`Поисковой запрос - скопирован!`)}
                >
                  <Button 
                    key="searh_in_internet"
                    size="small" 
                    icon="ie"
                    style={styleCss.internetBtn}
                  />
                </CopyToClipboard>
                <Badge 
                  count={digets && digets.digets ? digets.digets.length : null} 
                  offset={[-10, 0]} 
                  overflowCount={99}
                  style={styleCss.bange}
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
                    count={management_history.length} 
                    style={styleCss.companyHistory} 
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
        <RiskInfoDrawer toggleDrawer={showRisk} /> 
        { !isIp &&
          <CompanyHistoryInfoDrawer
            heads={heads}
            addUser={addNewUserToCheackList}
            toggleDrawer={showHistory} 
            headHistory={management_history}
          />
        }
      </>
    )
  }
}

const putStateToProps = state => {
  return {
    isIp: decodedisIp(state),
    heads: decodedManagementSource(state),
    companyResponse: decodedCompanyResponse(state),
    digets: storeMainDigest(state)
  }
}
const putActionToProps = {
  addNewUserToCheackList,
}

export default connect(putStateToProps, putActionToProps)(MainCompanyInfo)
