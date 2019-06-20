import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import { 
  decodedRequestLoading, 
  decodedMainCompanySource, 
  decodedRiskSource,
  decodedManagementSource
} from "../../../../selectors";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    requestLoading: decodedRequestLoading(state, 'openBill'),
    companySource: decodedMainCompanySource(state, 'openBill'),
    riskSource: decodedRiskSource(state, 'openBill'),
    managementSource: decodedManagementSource(state, 'openBill')
  }
}

export default connect(putStateToProps)(Container)
