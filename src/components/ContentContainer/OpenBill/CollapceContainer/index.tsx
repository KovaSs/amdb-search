import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";
import { actions, sl } from "../../../../store/ducks/openBill";

const Container: React.FC = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  return {
    company: sl.decodedCompanyResponse(state),
    documents: sl.decodedDocuments(state),
    requestLoading: sl.decodedRequestLoading(state),
    companySource: sl.decodedMainCompanySource(state),
    riskSource: sl.decodedRiskSource(state),
  }
}

const putActionToProps = {
  getDocument: actions.getDocument
}

export default connect(putStateToProps, putActionToProps)(Container)
