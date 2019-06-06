import React from 'react'
import { connect } from "react-redux";
import { actionChangeInn, actionChangeOgrn, loadCompanyInfo, loadingCompanyInfo, clearCompanyInfo } from "../../../../store/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput store={props}/>

const putStateToProps = state => {
  const {creditConveyor : { companyResponse, renderData }} = state
  return {
    companyResponse,
    renderData
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
