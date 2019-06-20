import React from 'react'
import { connect } from "react-redux";
import { 
  actionChangeInn as actionChangeOpenBillInn, 
  loadCompanyInfo as loadCompanyOpenBillInfo, 
  clearCompanyInfo as clearCompanyOpenBillInfo 
} from "../../../../store/ducks/openBill";
import { 
  decodedCompanyResponse,
  decodedRenderData,
  decodedInn,
  decodedErrors
} from "../../../../selectors";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  return {
    companyResponse: decodedCompanyResponse(state),
    renderData: decodedRenderData(state),
    inn: decodedInn(state), 
    errors: decodedErrors(state)
  }
}

const putActionsToProps =  {
  actionChangeOpenBillInn,
  loadCompanyOpenBillInfo,
  clearCompanyOpenBillInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
