import React from 'react'
import { connect } from "react-redux";
import { decodedRequestLoading, decodedMainCompanySource, decodedRiskSource, decodedManagementSource, identifyUser } from "../../../../store/ducks/openBill";
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

const putActionsToProps =  {
  identifyUser
}

export default connect(putStateToProps, putActionsToProps)(Container)
