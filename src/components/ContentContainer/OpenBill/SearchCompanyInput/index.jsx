import React from 'react'
import { connect } from "react-redux";
import { 
  actionChangeInn as actionChangeOpenBillInn, 
  loadCompanyInfo as loadCompanyOpenBillInfo, 
  clearCompanyInfo as clearCompanyOpenBillInfo 
} from "../../../../store/ducks/openBill";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  const {openBill : { companyResponse, renderData, inn, errors }} = state
  return {
    companyResponse,
    renderData,
    inn, 
    errors
  }
}

const putActionsToProps =  {
  actionChangeOpenBillInn,
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
