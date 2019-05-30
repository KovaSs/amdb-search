import React, { Component } from "react";
import { Route } from 'react-router-dom';
// import BreadcrumbContainer from "./BreadcrumbContainer";
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
        {/* <BreadcrumbContainer style={{ margin: "16px 0" }} /> */}
        <div className="ant-layout-content__data">
          <Route path='/' exact component={MainPage}/>
          <Route path='/open-bill' exact component={OpenBill}/>
          <Route path='/credit-conveyor' exact component={CreditConveyor}/>
          <Route path='/electronic-bank-garantees' exact component={ElectronicBankGarantees}/>
          <Route path='/electronic-bank-garantees/:id' render={({match}) => {
            const { id } = match.params
            return <ObjectRequestItem objectInn={id} />
          }}/>
          <Route path='/early-warning-system' exact component={EarlyWarningSystem}/>
        </div>
      </Content>
    );
  }
}

export default ContentContainer;
