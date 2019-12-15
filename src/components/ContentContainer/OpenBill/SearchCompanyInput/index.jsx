import React from 'react'
import { connect } from "react-redux"
import SearchCompanyInput from "./SearchCompanyInput"
import { withRouter } from 'react-router-dom'
import { actions, sl } from "../../../../store/ducks/openBill"

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  return {
    companyResponse: sl.decodedCompanyResponse(state),
    renderData: sl.decodedRenderData(state),
    inn: sl.decodedInn(state), 
    errors: sl.decodedErrors(state).get("companyMainInfoUpdate")
  }
}

const putActionsToProps = {
  actionChangeInn: actions.actionChangeInn,
  loadCompanyInfo: actions.loadCompanyInfo,
  clearCompanyInfo: actions.clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(withRouter(Container))
