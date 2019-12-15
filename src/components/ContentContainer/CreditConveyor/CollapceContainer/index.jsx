import React from 'react'
import { connect } from "react-redux";
import { sl } from "../../../../store/ducks/creditConveyor";
import { CollapceContainer } from "./CollapceContainer";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    requestLoading: sl.decodedRequestLoading(state),
    companySource: sl.decodedMainCompanySource(state),
    riskSource: sl.decodedRiskSource(state),
    managementSource: sl.decodedManagementSource(state)
  }
}

export default connect(putStateToProps)(Container)
