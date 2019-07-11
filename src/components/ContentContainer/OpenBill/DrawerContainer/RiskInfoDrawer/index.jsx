import React, { Component } from 'react';
import { Drawer, AutoComplete, Input, Button, Row, Col, Table } from "antd";
import toggleDrawer from '../index'
import "./risk-info-digest.scss"
import { uuid } from '../../../../../services/utils';

class RiskInfoDrawer extends Component {
  state = {
    riskFactors: [],
    digestSourse: [],
    selectedKod: "",
    selectedText: "",
    selectedComment: ""
  }

  componentDidMount() {
    console.log(`mount`)
    fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest',
          data: {}
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
    .then( res => {
      this.setState(() =>({
        riskFactors: res.data.risks,
        digestSourse: res.data.digits
      }))
    })
  }

  submitRiskFactor = () => {
    const { reqnum } = this.props
    const { selectedKod, selectedComment } = this.state
    if(selectedKod && selectedComment ) {
      fetch(
        `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
        { 
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body : JSON.stringify({ 
            type: 'digest',
            reqnum: reqnum,
            data: {
              t_user_request_risk_id: selectedKod,
              comment: selectedComment
            }
          }),
        }
      )
      .then(res => {
        if (res.ok) return res.json()
        throw new TypeError("Ввод риск фактора не осуществлен!")
      })
      .then( res => {
        this.setState(() =>({
          riskFactors: res.data.risks,
          digestSourse: res.data.digest,
          selectedKod: "",
          selectedText: "",
          selectedComment: ""
        }))
      })
    }
  }

  render() {
    const { Option } = AutoComplete
    const { TextArea } = Input
    const { onClose, visible } = this.props
    const { riskFactors, selectedText, selectedComment, digestSourse } = this.state

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

    const Btn = props => {
      const deleteRiskFactor = () => {
        console.log('props.factor', props.factor)
        const { reqnum } = this.props
          fetch(
            `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
            { 
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              body : JSON.stringify({ 
                type: 'digest',
                reqnum: reqnum,
                data: {
                  delete: props.factor.id
                }
              }),
            }
          )
          .then(res => {
            if (res.ok) return res.json()
            throw new TypeError("Ввод риск фактора не осуществлен!")
          })
          .then( res => {
            this.setState(() =>({
              riskFactors: res.data.risks,
              digestSourse: res.data.digest,
              selectedKod: "",
              selectedText: "",
              selectedComment: ""
            }))
          })
      }
      return (
        <Button 
          onClick={deleteRiskFactor}
        >
          Удалить
        </Button>
      )
    }

     /** Табилица Вывода риск факторов */
    const RenderRisksTable = () => {
      const arbiterData = digestSourse ? digestSourse.map(item => {
        return {
          key: uuid(),
          kod: item.t_user_request_risk_id,
          comment: item.comment,
          id: item.rowid,
          delete: "Взаимодействие и удаление записи"
        }
      }) : []
      const columns = [
        { title: 'Код', dataIndex: 'kod'},
        { title: 'Комментарий', dataIndex: 'comment' }, 
        { title: 'Удалить', render: (data, record) => <Btn factor={record}/>}
      ];
      return (
        <Table
          size="small"
          columns={columns}
          align="center"
          dataSource={arbiterData}
          style={{marginTop: 20}}
          bordered
          pagination={false}
          className="arbiter-risk-info"
        />
      )
    }

    const handleSelectOption = value =>  this.setState({ selectedKod: value })
    const handleChangeOntion = value =>  this.setState({ selectedText: value })
    const handleChangeComment = e =>  {const value = e.target.value; this.setState({ selectedComment: value })}

    return (
      <Drawer
        width={"50%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <h2>Дайджест</h2>
        <Row className="add-risk-digest">
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
          <Col span={16}>
            <TextArea 
              row={3}
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
          <Col span={24}>
            {RenderRisksTable()}
          </Col>
        </Row>
      </Drawer>
    );
  }
}


export default toggleDrawer(RiskInfoDrawer)