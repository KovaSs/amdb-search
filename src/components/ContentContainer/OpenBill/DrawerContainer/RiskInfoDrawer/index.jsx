import React, { Component } from 'react';
import { Drawer, AutoComplete } from "antd";
import toggleDrawer from '../index'


class RiskInfoDrawer extends Component {
  state = {
    riskFactors: [],
    selectedFactor: ""
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
        riskFactors: res.data.risks
      }))
    })
  }

  render() {
    const { Option } = AutoComplete
    const { onClose, visible } = this.props
    const { selectedFactor, riskFactors } = this.state

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

    return (
      <Drawer
        width={"50%"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <h2>Дайджест</h2>
        <div>
          <AutoComplete
            size="small"
            key="risk_faktors"
            style={{ width: 200 }}
            value={selectedFactor}
            dataSource={riskFactors ? riskFactors.map(renderOption) : false}
            // onSelect={handleSelectOption}
            // onChange={handleChangeSurName}
            placeholder="Риск факторы"
            // filterOption={(value, option) =>  option.props.children.toUpperCase().indexOf(value.toUpperCase()) !== -1}
            allowClear
          />
        </div>
      </Drawer>
    );
  }
}


export default toggleDrawer(RiskInfoDrawer)