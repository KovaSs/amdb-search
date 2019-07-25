import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import store from "../../../../store";
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
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      company: ebgCompanyResponse(state),
      requestLoading: ebgRequestLoading(state),
      companySource: ebgMainCompanySource(state),
      riskSource: ebgRiskSource(state),
    }
  }
  return {
    company: decodedCompanyResponse(state),
    requestLoading: decodedRequestLoading(state),
    companySource: decodedMainCompanySource(state),
    riskSource: decodedRiskSource(state),
  }
}

export default connect(putStateToProps)(Container)
