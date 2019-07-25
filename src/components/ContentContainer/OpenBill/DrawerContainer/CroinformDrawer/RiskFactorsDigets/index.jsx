import React, { Component } from 'react'
import {  Row, Col, AutoComplete, Button, Icon, Collapse, ConfigProvider, Table, Empty, Input } from 'antd'
import { differenceBy } from 'lodash'
import { connect } from "react-redux"
import { uuid, getTimeAndDate, ebg } from '../../../../../../services/utils'
import { 
  decodedRequestLoading, 
  decodedDigetsList, 
  addRiskFactor, 
  deleteRiskFactor 
} from "../../../../../../store/ducks/openBill";
import { 
  decodedRequestLoading as ebgRequestLoading, 
  decodedDigetsList as ebgDigetsList, 
  addRiskFactor as ebgAddRiskFactor, 
  deleteRiskFactor as  ebgDeleteRiskFactor
} from "../../../../../../store/ducks/electronicBankGarantees";

class RiskFactorsDigets extends Component {
  state = {
    riskFactors: [],
    digestSourse: [],
    historySourse: [],
    selectedKod: "",
    selectedText: "",
    selectedComment: ""
  }

  componentDidUpdate(prevProps) {
    const { digets } = this.props
    if(prevProps.digets !== digets) {
      this.setState(() => ({
        riskFactors: digets.risks,
        digestSourse: digets.digest,
        historySourse: digets.history,
      }))
    }
  }

  componentDidMount(prevProps) {
    const { digets } = this.props
    this.setState(() => ({
      riskFactors: digets.risks,
      digestSourse: digets.digest,
      historySourse: digets.history,
    }))
  }

  submitRiskFactor = () => {
    const { addRiskFactor } = this.props
    const { selectedKod, selectedComment } = this.state

    if(selectedKod && selectedComment) {
      addRiskFactor({
        t_user_request_risk_id: selectedKod,
        comment: selectedComment
      })
      this.setState({
        selectedKod: "",
        selectedText: "",
        selectedComment: ""
      })
    }
  }

  render() {
    const { Option } = AutoComplete
    const { Panel } = Collapse

    const { deleteRiskFactor, requestLoading} = this.props
    const { riskFactors, selectedText, selectedComment, digestSourse, historySourse } = this.state
    const loadingDigetsStatus = requestLoading.get("digestList") || requestLoading.get("addRistFactorInDigestList") || requestLoading.get("deleteRistFactorInDigestList")
    const loadingHistoryStatus = requestLoading.get("digestList") || requestLoading.get("deleteRistFactorInDigestList")
  
    const renderOption = item => {
      return (
        <Option 
          key={item.kod} 
          text="risks" 
          title={`${item.kod} / ${item.risk_faktor}`} 
          value={item.kod}
        >
          {`${item.kod} / ${item.risk_faktor}`} 
        </Option>
      )
    }
  
    const RiskInfoComponent = () => {
      return <Row className="add-risk-digest">
          <Col span={6}>
            <AutoComplete
              size="small"
              key="risk_faktors"
              style={{ width: 200 }}
              value={selectedText}
              dataSource={riskFactors ? riskFactors.map(renderOption) : false}
              onSelect={handleSelectOption}
              onChange={handleChangeOntion}
              placeholder="Риск факторы"
              // filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
              allowClear
            />
          </Col>
          <Col span={15}>
            <Input 
              placeholder="Введите комментарий"
              size="small"
              value={selectedComment}
              onChange={handleChangeComment}
            />
          </Col>
          <Col span={2}>
            <Button
              onClick={this.submitRiskFactor}
              style={{marginLeft: 5}}
            > 
              Добавить 
            </Button>
          </Col>
        </Row>
    }
  
    const Btn = props => {
      const deleteFactor = () => {
        deleteRiskFactor({ delete: props.factor.id })
      }
      return <Button  onClick={deleteFactor} > Удалить </Button>
    }
  
    const showFactorsMask = item => ({
      key: uuid(),
      id: item.rowid,
      kod: item.t_user_request_risk_id,
      date: item.vremya_akceptovaniya_zapisi ? getTimeAndDate(item.vremya_akceptovaniya_zapisi) : "Дата записи отсутствует" ,
      user: item.user_name ? item.user_name : "Имя пользователя отсутствует",
      comment: item.comment
    })
  
     /** Табилица Вывода риск факторов */
    const renderRisksTable = () => {
      const digestData = digestSourse ? digestSourse.map(showFactorsMask) : []
      const columns = [
        { title: 'Дата записи', dataIndex: 'date'},
        { title: 'Пользователь', dataIndex: 'user'},
        { title: 'Код риск-фактора', dataIndex: 'kod'},
        { title: 'Комментарий', dataIndex: 'comment' }, 
        { title: '', render: (data, record) => <Btn factor={record}/>}
      ];
      return (
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span>Введите риск фактор</span> } /> }>
          <Table
            size="small"
            align="center"
            title={RiskInfoComponent}
            loading={loadingDigetsStatus}
            columns={columns}
            dataSource={digestData}
            bordered
            pagination={false}
            className="arbiter-risk-info"
          />
        </ConfigProvider>
      )
    }
  
     /** Табилица Вывода Истории по риск факторам */
    const renderRisksTableHistoryRequest = () => {
      const historyData = historySourse ? differenceBy(historySourse, digestSourse, "rowid").map(showFactorsMask) : []
      const columns = [
        { title: 'Дата записи', dataIndex: 'date'},
        { title: 'Пользователь', dataIndex: 'user'},
        { title: 'Код риск-фактора', dataIndex: 'kod'},
        { title: 'Комментарий', dataIndex: 'comment' }, 
        { title: '', render: (data, record) => <Btn factor={record}/>}
      ];
      return (
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span>Исторические данные отвутствуют</span> } /> }>
          <Table
            size="small"
            align="center"
            loading={loadingHistoryStatus}
            columns={columns}
            dataSource={historyData}
            bordered
            pagination={false}
            className="arbiter-risk-info"
          />
        </ConfigProvider>
      )
    }
  
    const handleSelectOption = value =>  this.setState({ selectedKod: value })
    const handleChangeOntion = value =>  this.setState({ selectedText: value })
    const handleChangeComment = e =>  {const value = e.target.value; this.setState({ selectedComment: value })}
  
    return (
      <Collapse 
        size="small"
        defaultActiveKey={['1', '2', '3', '4']} 
        expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"}/> }
      >
        <Panel header="Ручной ввод риск факторов" key="1" showArrow={false}>
          {renderRisksTable()}
        </Panel>
        <Panel header="История результатов проверки" key="2" showArrow={false}>
          {renderRisksTableHistoryRequest()}
        </Panel>
      </Collapse>
    )
  }
}

const putStateToProps = state => {
  return {
    requestLoading: ebg() ? ebgRequestLoading(state) : decodedRequestLoading(state),
    digets: ebg() ? ebgDigetsList(state) : decodedDigetsList(state),
  }
}

const putActionsToProps = {
  addRiskFactor: ebg() ? ebgAddRiskFactor : addRiskFactor,
  deleteRiskFactor: ebg() ? ebgDeleteRiskFactor : deleteRiskFactor
}

export default connect(putStateToProps, putActionsToProps)(RiskFactorsDigets)