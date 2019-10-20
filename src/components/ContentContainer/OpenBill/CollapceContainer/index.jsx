import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import { 
  decodedRequestLoading, 
  decodedMainCompanySource, 
  decodedRiskSource, 
  decodedCompanyResponse,
  decodedDocuments,
  getDocument
} from "../../../../store/ducks/openBill";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    company: decodedCompanyResponse(state),
    documents: decodedDocuments(state),
    requestLoading: decodedRequestLoading(state),
    companySource: decodedMainCompanySource(state),
    riskSource: decodedRiskSource(state),
  }
}

const putActionToProps = {
  getDocument
}

export default connect(putStateToProps, putActionToProps)(Container)
