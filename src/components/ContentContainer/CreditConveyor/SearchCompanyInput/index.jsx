import React from 'react'
import { connect } from "react-redux";
import { actions, sl } from "../../../../store/ducks/creditConveyor";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  return {
    companyResponse: sl.decodedCompanyResponse(state),
    renderData: sl.decodedRenderData(state),
    inn: sl.decodedInn(state), 
    errors: sl.decodedErrors(state)
  }
}

const putActionsToProps =  {
  actionChangeInn: actions.actionChangeInn,
  loadCompanyInfo: actions.loadCompanyInfo,
  clearCompanyInfo: actions.clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
