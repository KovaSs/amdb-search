import React from 'react'
import { connect } from "react-redux";
import { actionChangeInn, loadCompanyInfo, clearCompanyInfo } from "../../../../store/ducks/creditConveyor";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = store => {
  const {creditConveyor : { companyResponse, renderData, inn }} = store
  return {
    companyResponse,
    renderData,
    inn
  }
}

const putActionsToProps =  {
  actionChangeInn,
  loadCompanyInfo,
  clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
