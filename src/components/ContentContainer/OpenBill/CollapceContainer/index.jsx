import React from 'react'
import { connect } from "react-redux";
import { decodedRequestLoading, decodedMainCompanySource, decodedRiskSource, decodedManagementSource } from "../../../../store/ducks/openBill";
import { CollapceContainer } from "./CollapceContainer";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    requestLoading: decodedRequestLoading(state),
    companySource: decodedMainCompanySource(state),
    riskSource: decodedRiskSource(state),
    managementSource: decodedManagementSource(state)
  }
}

export default connect(putStateToProps)(Container)
