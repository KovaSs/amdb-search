import React from 'react'
import { connect } from "react-redux";
import { actionChangeOpenBillInn, loadCompanyOpenBillInfo, clearCompanyOpenBillInfo } from "../../../../store/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  const {openBill : { companyResponse, renderData, inn }} = state
  return {
    companyResponse,
    renderData,
    inn
  }
}

const putActionsToProps =  {
  actionChangeOpenBillInn,
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
