import React, { Component } from 'react';
import { connect } from "react-redux";
import { 
  Drawer, 
  AutoComplete, 
  Input, 
  Button, 
  Row, 
  Col, 
  Table, 
  Collapse, 
  Icon, 
  ConfigProvider, 
  Empty,
  Tabs,
  Popconfirm,
  PageHeader,
  message,
  Typography,
  Popover
} from "antd";
import { differenceBy, uniqBy, compact } from 'lodash'
import { Btn, BtnEdit} from '../BtnComponent'
import JsonInfo from './JsonInfo'
import { getTimeAndDate, getDate, getDownloadTime } from '../../../../../../services/utils';
import { 
  decodedCompanyResponse,
  decodedManagementSource,
  decodedisIp, 
  storeMainDigest,
  storeRisksSrc,
  storeEbgJsonInfo,
  addRiskFactorUl, 
  deleteRiskFactorFl,
  decodedRequestLoading,
  addRiskFactorFl,
  updateDigetsUl,
  returnEbgItem,
  acceptEbgItem,
  downloadReport
} from "../../../../../../store/ducks/EBG"
import toggleDrawer from '../index'
import "./risk-info-digest.scss"

/** Инлайновые стили */
const styleCss = {
  autoScroll : {
    maxHeight: 100,
    overflowY: "auto",
    overflowX: "hidden",
    textAlign: "left"
  },
  finalyBtnWarning: {
    marginRight: 20
  },
  updateBtn : {
    color: "#0e75fdfd",
    margin: 0,
    top: 0,
    right: -10,
    zIndex: 10,
  },
  pIcon: {
    color: "#52c41a", 
    margin: "0 10px", 
    fontSize: 16
  },
  pDescr: {
    border: "1px solid #d9d9d97d",
    padding: 5,
    borderRadius: 4
  },
  pWrite: {
    whiteSpace: "pre-line"
  },
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto",
    overflowX: "hidden"
  },
  downloadFile: {
    zIndex: 10,
    marginTop: 10,
    color: "#0e75fdfd"
  },
}

class RiskInfoDrawer extends Component {
  state = {
    riskFactors: [],
    digestSourse: [],
    historySourse: [],
    selectedKod: "",
    selectedText: "",
    selectedComment: ""
  }

  componentDidMount() {
    const { digets, risks } = this.props
    this.setState(() =>({
      riskFactors: risks,
      digestSourse: digets.digets,
      historySourse: digets.history,
    }))
  }

  componentDidUpdate(prevProps) {
    const { digets, risks, requestLoading, visible } = this.props
    if(prevProps.digets !== digets) {
      this.setState(() =>({
        riskFactors: risks,
        digestSourse: digets.digets,
        historySourse: digets.history,
      }))
    }
    if(visible && prevProps.visible !== visible) {
      const {
        updateDigetsUl,
        companyResponse: {
          inn,
          name, 
          reqnum,
          key
        },
      } = this.props
      updateDigetsUl({
        inn, 
        id: key,
        storeCompName: name,
        reqnum: reqnum
      })
    }
    if(requestLoading.get("returnEbgItemRequest")) message.loading("Возврат в очередь проверки...", 999)
    if(requestLoading.get("acceptEbgItemRequest")) message.loading("Завершение проверки...", 999)
  }

  componentWillUnmount() {
    message.destroy()
  }

  submitRiskFactor = () => {
    const {
      isIp,
      addRiskFactorUl,
      companyResponse: {
        inn,
        name, 
        full_name,
        reqnum,
        key
      },
    } = this.props
    const { selectedKod, selectedComment } = this.state

    if(selectedKod) {
      addRiskFactorUl({
        t_user_request_risk_id: selectedKod,
        comment: selectedComment,
        check_type: 4
      },
      {
        inn, 
        id: key,
        storeCompName: isIp ? full_name : name,
        reqnum
      })
      this.setState({
        selectedKod: "",
        selectedText: "",
        selectedComment: ""
      })
    }
  }

  renderOption = item => {
    const { Option } = AutoComplete
    if(item.is_fl !== "1") return (
      <Option 
        key={item.kod} 
        text="risks" 
        title={`${item.kod} / ${item.risk_faktor}`} 
        value={item.rowid}
      >
        {`${item.kod} / ${item.risk_faktor}`} 
      </Option>
    )
    else return null
  }

  handleSelectOption = value =>  this.setState({ selectedKod: value })

  handleChangeOntion = value =>  this.setState(() => {
    if(!value) return { selectedKod: value, selectedText: value }
    return { selectedText: value }
  })

  handleChangeComment = ({target: {value}}) =>  this.setState({ selectedComment: value })

  changeEditItem = ({target: {value}}) => this.setState(() => {
    if(!value) return { editFaktorText: "" }
    return { editFaktorText: value }
  })

  /** Отмена редактирования комментария риск-фактора */
  canselEdit = () => this.setState({editFaktorKey: "", editFaktorText: ""})

  /** Преобразование входящих данных для таблицы */
  showFactorsMask = item => {
    const { risks } = this.props
    const findKod = risks.find(risk => risk.rowid === item.t_user_request_risk_id)
    return {
      key: item.key,
      id: item.rowid,
      kod: item.t_user_request_risk_id,
      kodParse: findKod ? findKod.kod : item.familia ? "ФЛ-СБ-28" : "ЮЛ-СБ-23",
      kodText: findKod ? findKod.risk_faktor : "Прочая негативная информация, способная повлиять на принятие решения о сотрудничестве (межбанк и т.п., с раскрытием комментария в отношении риск-фактора)",
      date: item.vremya_akceptovaniya_zapisi && !item.familia ? getTimeAndDate(item.vremya_akceptovaniya_zapisi) :
        item.time ? getTimeAndDate(item.time) : "Дата записи отсутствует" ,
      dateEdit: item.data_redaktirovaniya_zapisi && item.vremya_redaktirovaniya_zapisi ? 
        getTimeAndDate(`${item.data_redaktirovaniya_zapisi} ${item.vremya_redaktirovaniya_zapisi}`) : "Дата записи отсутствует" ,
      user: item.user_name ? item.user_name : "Имя пользователя отсутствует",
      userEdit: item.user_name_edit ? item.user_name_edit : false,
      comment: item.familia ? item.risk1 : item.comment,
      object: item.object,
      name: item.name,
      ip: item.ip_adres_dobavleniya_zapisi,
      ipEdit: item.ip_adres_redaktirovaniya_zapisi,
      isFl: item.familia ? true : false
    }
  }

  updateDigest = e => {
    e.stopPropagation()
    const {
      updateDigetsUl,
      companyResponse: {
        inn,
        name, 
        reqnum,
        key
      },
    } = this.props
    updateDigetsUl({
      inn, 
      id: key,
      storeCompName: name,
      reqnum: reqnum
    })
  }

  render() {
    const { Panel } = Collapse
    const { Paragraph } = Typography
    const { TabPane } = Tabs
    const {
      isIp,
      companyResponse: {
        inn: innObj,
        name, 
        full_name,
        key
      },
      onClose, 
      visible, 
      returnEbgItem,
      acceptEbgItem,
      requestLoading
    } = this.props
    const { riskFactors, selectedText, selectedComment, digestSourse, historySourse, selectedKod } = this.state
    const loadingDigetsStatus = 
      requestLoading.getIn(["digestListUl", key]) || 
      requestLoading.getIn(["addRistFactorInDigestListUl", key], false) || 
      requestLoading.get("deleteRistFactorInDigestList")
    const loadingHistoryStatus = 
      requestLoading.getIn(["digestListUl", key]) || 
      requestLoading.get("deleteRistFactorInDigestList")

    const RiskInfoComponent = () => {
      const { Search } = Input
      const risksSrc = riskFactors ? compact(riskFactors.map(this.renderOption)) : false
      return (
        <Row className="add-risk-digest">
          <Col span={6}>
            <AutoComplete
              size="small"
              key="risk_faktors"
              style={{ width: "100%" }}
              value={selectedText}
              dataSource={risksSrc}
              onSelect={handleSelectOption}
              onChange={handleChangeOntion}
              placeholder="Выберите риск фактор"
              // filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
              allowClear
            />
          </Col>
          <Col span={18}>
            <Search
              size="small"
              suffix={<span style={styleCss.suffix}/>}
              placeholder="Введите комментарий"
              value={selectedComment}
              onChange={this.handleChangeComment}
              onSearch={this.submitRiskFactor}
              onPressEnter={this.submitRiskFactor}
              enterButton={ 
                <Button 
                  type="default"
                  style={{ height: 24 }}
                  disabled={!selectedComment && !selectedKod}
                > 
                  Добавить 
                </Button>
              }
              allowClear
            />
          </Col>
        </Row>
      )
    }

    /** Колонки отображения актуальных и исторических риск-факторов для таблиц */
    const renderColums = ({actualData, historyData, actual}, columns) => {
      const { TextArea } = Input
      const { editFaktorKey, editFaktorText } = this.state
      const objectFilters = actual ? 
        actualData ? uniqBy(actualData.map(item => ({text: item.name, value: item.name})), "value") : [] : 
        historyData ? uniqBy(historyData.map(item => ({text: item.name, value: item.name})), "value") : []
      const userFilters = actual ?
        actualData ? uniqBy(actualData.map(item => ({text: item.user, value: item.user})), "value") : [] :
        historyData ? uniqBy(historyData.map(item => ({text: item.user, value: item.user})), "value") : []
      const kodFilters = actual ?
        actualData ? uniqBy(actualData.map(item => ({text: item.kodParse, value: item.kodParse})), "value") : [] :
        historyData ? uniqBy(historyData.map(item => ({text: item.kodParse, value: item.kodParse})), "value") : []
      return columns = [
        { 
          title: 'Дата записи', 
          dataIndex: 'date', 
          width: "10%",
          render: (data, record) =>  record.userEdit ? record.dateEdit : record.date
        },
        { 
          title: 'Пользователь', 
          dataIndex: 'user', 
          width: "10%",
          filters: userFilters, 
          onFilter: (value, record) => record.user.indexOf(value) === 0 || (record.userEdit && record.userEdit.indexOf(value) === 0),
          render: (data, record) =>  {
            const content = (
              <div style={styleCss.popover}>
                <div><b>Добавлена:</b> {record.date}</div>
                <div><b>Пользователь:</b> {record.user}</div>
                <div style={{marginBottom: 5}}><b>IP адрес:</b> {record.ip}</div>
                { record.userEdit && 
                  <div style={{borderTop: "1px solid #d9d9d97d", paddingTop: 5}}>
                    <div><b>Отредактирована:</b> {record.dateEdit}</div>
                    <div><b>Пользователь:</b> {record.userEdit}</div>
                    <div><b>IP адрес:</b> {record.ipEdit}</div>
                  </div>
                }
              </div>
            )
            return record.userEdit ? 
              <Popover 
                key="userEdit-popover-info" 
                title="Информация" 
                content={content} 
                trigger="hover" 
              >
                { record.userEdit }
              </Popover> : 
              <Popover 
                key="user-popover-info" 
                title="Информация" 
                content={content} 
                trigger="hover" 
              >
                { record.user } 
              </Popover>
          }
        },
        {
          title: 'Объект проверки', 
          dataIndex: 'object', 
          width: "20%", 
          filters: objectFilters, 
          onFilter: (value, record) => record.name.indexOf(value) === 0,
        },
        { 
          title: 'Код риск фактора', 
          dataIndex: 'kodParse', 
          width: "10%",
          filters: kodFilters, 
          onFilter: (value, record) => record.kodParse.indexOf(value) === 0,
          render: (data, record) => (
            <Popover 
              key="kodParse-popover-info" 
              title={record.kodParse} 
              content={<div style={styleCss.popover}> { record.kodText } </div>} 
              trigger="hover" 
            >
              { record.kodParse }
            </Popover>
          )
        },
        { 
          title: 'Комментарий',
          dataIndex: 'comment',
          width: "45%",
          render: (value, record) => {
            if(editFaktorKey === record.key) return (
              <div style={styleCss.autoScroll}>
                <TextArea 
                  defaultValue={record.comment}
                  onChange={e => this.changeEditItem(e)}
                  autosize={{
                    minRow: 3,
                    maxRow: 4
                  }}
                />
              </div>
            )
            else if(!record.comment) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } />
            else return (
              <div style={styleCss.autoScroll}>
                <label style={styleCss.pWrite}>{ record.comment }</label>
              </div>
            )
          }
        }, 
        { 
          title: '', 
          width: "5%", 
          render: (data, record) => (
            <>
              { editFaktorKey === record.key  ? 
                <BtnEdit 
                  factor={record} 
                  canselEdit={this.canselEdit} 
                  changedComment={editFaktorText}
                  checkType={4}
                /> :
                <Btn 
                  factor={record}
                />
              }
            </>
          )
        }
      ];
    }

     /** Табилица Вывода риск факторов */
    const renderRisksTable = () => {
      const actualData = digestSourse ? digestSourse.map(this.showFactorsMask) : []
      const AcceptBtnComponent = () => (
        <div style={styleCss.finalyPopover}>
            <Popconfirm
              title={
                <div style={{width: 200}}>
                  <div style={{fontWeight: 500}}> Вернуть в очередь? </div>
                  <div> После подтверждения возврата в очерель проверки, объект станет доступен для проверки другим операторам </div>
                </div>
              }
              onConfirm={() => returnEbgItem({inn: innObj})}
              icon={<Icon type="question-circle-o" style={{color: "#ffc107"}}/>}
              placement="top"
              okText="Да"
              cancelText="Нет" 
            >
              <Button style={styleCss.finalyBtnWarning} >Вернуть в очередь</Button>
            </Popconfirm>
            <Popconfirm
              title={
                <div style={{width: 200}}>
                  <div style={{fontWeight: 500}}> Завершить проверку? </div>
                  <div> После подтверждения завершения проверки риск-факторы будут сохранены, и объект будет удален из проверки </div>
                </div>
              }
              onConfirm={() => acceptEbgItem({inn: innObj})}
              icon={<Icon type="question-circle-o" style={{color: "#28a745"}}/>}
              placement="top"
              okText="Да"
              cancelText="Нет" 
            >
              <Button type="primary">Завершить проверку</Button>
            </Popconfirm>
          </div>
      )

      return (
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span>Введите риск фактор</span> } /> }>
          <Table
            size="small"
            align="center"
            className="arbiter-risk-info digets-factor"
            title={RiskInfoComponent}
            footer={AcceptBtnComponent}
            columns={renderColums({actualData, actual: true})}
            dataSource={actualData}
            locale={{ filterReset: 'Сбросить' }}
            loading={loadingDigetsStatus}
            onRow={ (record, rowIndex) => ({ onDoubleClick: () => this.setState({editFaktorKey: record.key}) })}
            rowClassName={ (record, rowIndex) => record.userEdit ? "table-record-edited" : "" }
            pagination={{
              defaultPageSize: 10,
              hideOnSinglePage: true,
              showTotal: total => `Всего найдено: ${total}`
            }}
            bordered
          />
        </ConfigProvider>
      )
    }

     /** Табилица Вывода Истории по риск факторам */
    const renderRisksTableHistoryRequest = () => {
      const historyData = historySourse ? differenceBy(historySourse, digestSourse, "rowid").map(this.showFactorsMask) : []
      return (
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span>Исторические данные отвутствуют</span> } /> }>
          <Table
            size="small"
            align="center"
            className="arbiter-risk-info"
            columns={renderColums({
              digestSourse,
              historyData,
              actual: false
            })}
            dataSource={historyData}
            locale={{ filterReset: 'Сбросить' }}
            loading={loadingHistoryStatus}
            onRow={ (record, rowIndex) => ({ onDoubleClick: () => this.setState({editFaktorKey: record.key}) })}
            rowClassName={ (record, rowIndex) => record.userEdit ? "table-record-edited" : "" }
            pagination={{
              defaultPageSize: 10,
              hideOnSinglePage: true,
              showTotal: total => `Всего найдено: ${total}`
            }}
            bordered
          />
        </ConfigProvider>
      )
    }

    const handleSelectOption = value =>  this.setState({ selectedKod: value })
    const handleChangeOntion = value =>  this.setState(() => {
      if(!value) return { selectedKod: value, selectedText: value }
      return { selectedText: value }
    })

    const DownloadBtn = () => {
      const {downloadReport} = this.props
      return (
        <Button
            style={styleCss.downloadFile}
            icon="save"
            title={`${isIp ? full_name : name} ${getDownloadTime(Date.now())}`}
            onClick={ () => downloadReport({}) }
        >
          Cкачать результаты
        </Button>
      )
    }

    return (
      <Drawer
        width={"55%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-history"
      >
        <PageHeader 
          title="Результаты проверки"
          subTitle={`| ${isIp ? full_name : name}`}
          extra={ <DownloadBtn/> }
        >
          <Tabs >
            <TabPane tab="Риск-факторы" key="1">
              <Paragraph style={styleCss.pDescr}> 
                <Icon type="info-circle" style={styleCss.pIcon}/> 
                Для редактирования риск-факторов, дважды кликните по необходимой записи в таблице
              </Paragraph>
              <Collapse 
                size="small"
                defaultActiveKey={['1', '2', '3', '4']} 
                expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
              >
                <Panel 
                  key="1" 
                  header={`Актуальные на ${getDate(Date.now())} риск-факторы`} 
                  showArrow={false}
                  extra={
                    <Button 
                      size="small"
                      key="sync-risk-factors"
                      icon={loadingDigetsStatus ? "loading" : "sync"} 
                      title="Обновить список риск факторов"
                      onClick={e => this.updateDigest(e)}
                      style={styleCss.updateBtn}
                    />
                  }
                >
                  {renderRisksTable()}
                </Panel>
                <Panel header="История предыдущих проверок" key="2" showArrow={false}>
                  {renderRisksTableHistoryRequest()}
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab="JSON Информация" key="2">
              <JsonInfo />
            </TabPane>
          </Tabs>
        </PageHeader>
      </Drawer>
    );
  }
}

const putStateToProps = state => {
  return {
    isIp: decodedisIp(state),
    digets: storeMainDigest(state),
    risks: storeRisksSrc(state),
    heads: decodedManagementSource(state),
    requestLoading: decodedRequestLoading(state),
    companyResponse: decodedCompanyResponse(state),
    jsonInfo: storeEbgJsonInfo(state),
  }
}

const putActionsToProps = {
  addRiskFactorFl,
  addRiskFactorUl,
  deleteRiskFactorFl,
  updateDigetsUl,
  returnEbgItem,
  acceptEbgItem,
  downloadReport
}

export default connect(putStateToProps, putActionsToProps)(toggleDrawer(RiskInfoDrawer))