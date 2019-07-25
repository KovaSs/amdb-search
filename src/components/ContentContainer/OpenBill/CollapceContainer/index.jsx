import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import { ebg } from "../../../../services/utils";
import { 
  decodedRequestLoading, 
  decodedMainCompanySource, 
  decodedRiskSource, 
  decodedCompanyResponse 
} from "../../../../store/ducks/openBill";
import { 
  decodedRequestLoading as ebgRequestLoading, 
  decodedMainCompanySource as ebgMainCompanySource, 
  decodedRiskSource as ebgRiskSource, 
  decodedCompanyResponse as ebgCompanyResponse
} from "../../../../store/ducks/electronicBankGarantees";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    company: ebg() ? ebgCompanyResponse(state) : decodedCompanyResponse(state),
    requestLoading: ebg() ? ebgRequestLoading(state) : decodedRequestLoading(state),
    companySource: ebg() ? ebgMainCompanySource(state) : decodedMainCompanySource(state),
    riskSource: ebg() ? ebgRiskSource(state) : decodedRiskSource(state),
  }
}

export default connect(putStateToProps)(Container)
