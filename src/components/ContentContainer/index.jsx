import React, { Component } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from "./MainPage";
import OpenBill from "./OpenBill";
import EbgItem from "./ElectronicBankGarantees/EbgItem";
import TestRequest from "./TestRequest";
import CreditConveyor from "./CreditConveyor";
import EarlyWarningSystem from "./EarlyWarningSystem";
import StopListSearch from "./StopListSearch";
import EwsConponent from "./EarlyWarningSystem/EwsComponent";
import ElectronicBankGarantees from "./ElectronicBankGarantees";
import { Layout} from 'antd';
import { API } from '../../services/api';

export class ContentContainer extends Component {

  componentDidMount() {
    API.getDigestList()
  }

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
            <Route path='/electronic-bank-garantees/:id' exact render={this.searchRbgItem}/>
            <Route path='/early-warning-system' exact component={EarlyWarningSystem}/>
            <Route path='/early-warning-system/test' exact component={EwsConponent}/>
            <Route path='/stop-lists-search' exact component={StopListSearch}/>
            <Route path='/test' exact component={TestRequest}/>
            <Redirect to='/'/>
          </Switch>
        </div>
      </Content>
    );
  }

  searchOpenBillItem = ({match}) => {
    const { id } = match.params
    return <OpenBill billInn={id} />
  }
  searchRbgItem = ({match}) => {
    const { id } = match.params
    return <EbgItem ebgInn={id} />
  }
}

export default ContentContainer