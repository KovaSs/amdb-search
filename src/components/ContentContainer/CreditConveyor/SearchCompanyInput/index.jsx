import React from 'react'
import { connect } from "react-redux";
import { actionChangeInn, actionChangeOgrn, loadCompanyInfo, loadingCompanyInfo, clearCompanyInfo } from "../../../../store/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  const {creditConveyor : { companyResponse, renderData, inn }} = state
  return {
    companyResponse,
    renderData,
    inn
  }
}

const putActionsToProps =  {
  actionChangeInn,
  actionChangeOgrn,
  loadingCompanyInfo,
  loadCompanyInfo,
  clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
