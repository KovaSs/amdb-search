import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import MainPage from "./MainPage";
import OpenBill from "./OpenBill";
import CreditConveyor from "./CreditConveyor";
import EarlyWarningSystem from "./EarlyWarningSystem";
import ElectronicBankGarantees from "./ElectronicBankGarantees";
import ObjectRequestItem from "./ElectronicBankGarantees/ObjectRequestItem";
import { Layout} from 'antd';

export class ContentContainer extends Component {
  render() {
    const { Content } = Layout;
    return (
      <Content style={{ minHeight: "80vh" }}>
        <div className="ant-layout-content__data">
          <Switch>
            <Route path='/' exact component={MainPage}/>
            <Route path='/open-bill' exact component={OpenBill}/>
            <Route path='/credit-conveyor' exact component={CreditConveyor}/>
            <Route path='/electronic-bank-garantees' exact component={ElectronicBankGarantees}/>
            <Route path='/electronic-bank-garantees/:id' render={this.getSearchObject}/>
            <Route path='/early-warning-system' exact component={EarlyWarningSystem}/>
            <Route path='/test' exact render={this.getTestRequest}/>
          </Switch>
        </div>
      </Content>
    );
  }

  getSearchObject = ({match}) => {
    const { id } = match.params
    return <ObjectRequestItem objectInn={id} />
  }

  getTestRequest = () => {
    const request = () => {
      return fetch(
        `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
        { 
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body : JSON.stringify({ 
            type: 'fl',
            method: 'bases',
            surname: "Масютина",
            firstname: "Жанна",
            middlename: "Ивановна",
            birthdate: ["1976-12-10", "1971-12-10", "1976-10-01"],
            series: "6602",
            number: "604372",
            inn: "670700894121"
          }),
        }
      )
      .then(res => {
        if (res.ok) return res.json()
        throw new TypeError("Ошибка получения данных!")
      })
    }
    return <button onClick={request}> Запрос </button>
  }
}

export default ContentContainer;
