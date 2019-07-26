import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import MainPage from "./MainPage";
import OpenBill from "./OpenBill";
import EBG from "./EBG";
import TestRequest from "./OpenBill/TestRequest";
import CreditConveyor from "./CreditConveyor";
import EarlyWarningSystem from "./EarlyWarningSystem";
import ElectronicBankGarantees from "./ElectronicBankGarantees";
// import ObjectRequestItem from "./ElectronicBankGarantees/ObjectRequestItem";
import { Layout} from 'antd';
import { getDigestList } from '../../services/api';

export class ContentContainer extends Component {

  componentDidMount() {
    getDigestList()
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
            <Route path='/electronic-bank-garantees/:id' render={this.getSearchObject}/>
            <Route path='/early-warning-system' exact component={EarlyWarningSystem}/>
            <Route path='/test' exact component={TestRequest}/>
          </Switch>
        </div>
      </Content>
    );
  }

  getSearchObject = ({match}) => {
    const { id } = match.params
    return <EBG ebgInn={id} />
  }
}

export default ContentContainer