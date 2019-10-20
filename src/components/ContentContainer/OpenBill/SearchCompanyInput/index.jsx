import React from 'react'
import { connect } from "react-redux"
import SearchCompanyInput from "./SearchCompanyInput"
import { withRouter } from 'react-router-dom'
import { 
  decodedCompanyResponse, 
  decodedRenderData, 
  decodedInn,
  decodedErrors,
  actionChangeInn, 
  loadCompanyInfo, 
  clearCompanyInfo
} from "../../../../store/ducks/openBill"

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  return {
    companyResponse: decodedCompanyResponse(state),
    renderData: decodedRenderData(state),
    inn: decodedInn(state), 
    errors: decodedErrors(state).get("companyMainInfoUpdate")
  }
}

const putActionsToProps = {
  actionChangeInn,
  loadCompanyInfo,
  clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(withRouter(Container))
