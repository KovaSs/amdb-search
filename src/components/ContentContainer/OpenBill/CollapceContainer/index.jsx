import React from 'react'
import { connect } from "react-redux";
import { decodedRequestLoading, decodedMainCompanySource, decodedRiskSource, decodedCompanyResponse } from "../../../../store/ducks/openBill";
import { CollapceContainer } from "./CollapceContainer";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    company: decodedCompanyResponse(state),
    requestLoading: decodedRequestLoading(state),
    companySource: decodedMainCompanySource(state),
    riskSource: decodedRiskSource(state),
  }
}

export default connect(putStateToProps)(Container)
