import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import { 
  decodedRequestLoading, 
  decodedMainCompanySource, 
  decodedRiskSource, 
  decodedCompanyResponse,
} from "../../../../../store/ducks/EBG";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = (state, props) => {
  return {
    company: decodedCompanyResponse(state),
    requestLoading: decodedRequestLoading(state),
    companySource: decodedMainCompanySource(state),
    riskSource: decodedRiskSource(state, props.mainKey),
  }
}

export default connect(putStateToProps)(Container)
