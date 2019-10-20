import React, { Component } from 'react'
import {  
  Row, 
  Col, 
  AutoComplete, 
  Button, 
  Icon, 
  Collapse, 
  ConfigProvider, 
  Table, 
  Empty, 
  Input,
  Typography,
  Popover
} from 'antd'
import { differenceBy, compact, uniqBy } from 'lodash'
import { connect } from "react-redux"
import { Btn, BtnEdit} from '../../BtnComponent'
import { getTimeAndDate, getDate } from '../../../../../../../services/utils'
import {
  decodedReqnum,
  decodedRequestLoading,
  storeRiskFactorsItem,
  storeRisksSrc,
  addRiskFactorFl,
  updateDigetsFl
} from "../../../../../../../store/ducks/EBG"

/** Инлайновые стили */
const styleCss = {
  autoScroll : {
    maxHeight: 100,
    overflowY: "auto",
    overflowX: "hidden",
    textAlign: "left"
  },
  pIcon: {
    color: "#52c41a", 
    margin: "0 10px", 
    fontSize: 16
  },
  pDescr: {
    border: "1px solid #d9d9d97d",
    padding: 5,
    borderRadius: 4,
  },
  pWrite: {
    whiteSpace: "pre-line"
  },
  updateBtn : {
    color: "#0e75fdfd",
    margin: 0,
    top: 0,
    right: -10,
    zIndex: 10,
  },
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto",
    overflowX: "hidden"
  },
}

class RiskFactorsDigets extends Component {
  state = {
    riskFactors: [],
    digestSourse: [],
    historySourse: [],
    selectedKod: "",
    selectedText: "",
    selectedComment: "",
    editFaktorKey: "", 
    editFaktorText: ""
  }

  componentDidMount() {
    const { digets, risks } = this.props
    this.setState(() => ({
      riskFactors: risks,
        digestSourse: digets.digets,
        historySourse: digets.history,
    }))
  }

  componentDidUpdate(prevProps) {
    const { digets, risks, visible, user, reqnum, updateDigetsFl } = this.props
    if((prevProps.digets !== digets) || (prevProps.risks !== risks)) {
      this.setState(() =>({
        riskFactors: risks,
        digestSourse: digets.digets,
        historySourse: digets.history,
      }))
    }
    if(visible && prevProps.visible !== visible) {
      updateDigetsFl(user, reqnum)
    }
  }

  submitRiskFactor = () => {
    const { addRiskFactorFl, user, userSelected } = this.props
    const { selectedKod, selectedComment } = this.state

    if(selectedKod) {
      addRiskFactorFl({
        SurName: user.selectedInfo ? user.selectedInfo.SurName : user.last_name,
        FirstName: user.selectedInfo ? user.selectedInfo.FirstName : user.first_name,
        MiddleName: user.selectedInfo ? user.selectedInfo.MiddleName : user.middle_name,
        INN: userSelected ? userSelected.inn : user.inn,
        DateOfBirth: userSelected ? userSelected.birthday : "",
        Seria: userSelected ? userSelected.Seria : "",
        Number: userSelected ? userSelected.Number : "",	
        t_user_request_risk_id: selectedKod,
        risk1: selectedComment,
        check_type: 4
      }, user.id)
      this.setState(() => ({
        selectedKod: "",
        selectedText: "",
        selectedComment: ""
      }))
    }
  }

  updateDigest = e => {
    e.stopPropagation()
    const { user, reqnum, updateDigetsFl } = this.props
    updateDigetsFl(user, reqnum)
  }

  // Подготовка данных для отображения риск-факторов в таблице
  showFactorsMask = item => {
    const { risks } = this.props
    const findKod = risks.find(factor => factor.rowid === String(item.t_user_request_risk_id))
    return {
      key: item.key,
      id: item.rowid,
      kod: item.t_user_request_risk_id,
      kodParse: findKod ? findKod.kod : "ФЛ-СБ-28",
      kodText: findKod ? findKod.risk_faktor : "Прочая негативная информация, способная повлиять на принятие решения о сотрудничестве (межбанк и т.п., с раскрытием комментария в отношении риск-фактора)",
      date: item.time ? getTimeAndDate(item.time) : "Дата записи отсутствует" ,
      dateEdit: item.data_redaktirovaniya_zapisi && item.vremya_redaktirovaniya_zapisi ? 
        getTimeAndDate(`${item.data_redaktirovaniya_zapisi} ${item.vremya_redaktirovaniya_zapisi}`) : "Дата записи отсутствует" ,
      user: item.user_name ? item.user_name : "Имя пользователя отсутствует",
      userEdit: item.user_name_edit ? item.user_name_edit : false,
      comment: item.risk1,
      object: item.object,
      name: item.name,
      ip: item.ip_adres_dobavleniya_zapisi,
      ipEdit: item.ip_adres_redaktirovaniya_zapisi,
      isFl: true
    }
  }

  // Подготовка опций селектора с доступными для ввода риск-факторами
  renderOption = item => {
    const { Option } = AutoComplete
    if(item.is_fl === "1") return (
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

  // Вводи данных комментария риск-факторов
  handleChangeComment = ({target: {value}}) =>  this.setState({ selectedComment: value })

  // Изменение редактируемого риск-фактора
  changeEditItem = ({target: {value}}) => this.setState(() => {
    if(!value) return { editFaktorText: "" }
    return { editFaktorText: value }
  })

  /** Отмена редактирования комментария риск-фактора */
  canselEdit = () => this.setState({editFaktorKey: "", editFaktorText: ""})

  handleChangeComment = ({target: {value}}) =>  this.setState({ selectedComment: value })

  handleSelectOption = value =>  this.setState({ selectedKod: value })
  
  handleChangeOntion = value =>  this.setState(() => {
      if(!value) return { selectedKod: value, selectedText: value }
      return { selectedText: value }
    })

  render() {
    const { Panel } = Collapse
    const { Paragraph } = Typography
    const { requestLoading, user } = this.props
    const { riskFactors, selectedComment, digestSourse, historySourse, selectedKod, selectedText } = this.state
    const loadingDigetsStatus = 
      requestLoading.getIn(["getRiskFactorsFl", user.id]) ||
      requestLoading.getIn(["addRistFactorInDigestListFl", user.id]) || 
      requestLoading.get("deleteRistFactorInDigestList")
    const loadingHistoryStatus = 
      requestLoading.getIn(["getRiskFactorsFl", user.id]) || 
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
              onSelect={this.handleSelectOption}
              onChange={this.handleChangeOntion}
              placeholder="Выберите риск фактор"
              filterOption={(value, option) =>  option ? option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1 : null}
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
                  checkType={2}
                /> :
                <Btn 
                  factor={record}
                  userFl={this.props.user}
                  digestFl={true} 
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
      return (
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span>Введите риск фактор</span> } /> }>
          <Table
            size="small"
            align="center"
            className="risk-factors-digets"
            title={RiskInfoComponent}
            loading={loadingDigetsStatus}
            columns={renderColums({actualData, actual: true})}
            dataSource={actualData}
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
            className="risk-factors-digets"
            loading={loadingHistoryStatus}
            dataSource={historyData}
            columns={renderColums({
              digestSourse,
              historyData,
              actual: false
            })}
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

    return (
      <>
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
          <Panel 
            key="2" 
            header="История результатов проверки" 
            showArrow={false}
          >
            {renderRisksTableHistoryRequest()}
          </Panel>
        </Collapse>
      </>
    )
  }
}

const putStateToProps = (state, props) => {
  return {
    digets: storeRiskFactorsItem(state, props.user.id),
    risks: storeRisksSrc(state),
    reqnum: decodedReqnum(state),
    requestLoading: decodedRequestLoading(state),
  }
}

const putActionsToProps = {
  addRiskFactorFl,
  updateDigetsFl
}

export default connect(putStateToProps, putActionsToProps)(RiskFactorsDigets)