import React from 'react'
import { connect } from "react-redux"
import SearchCompanyInput from "./SearchCompanyInput"
import store from "../../../../store"
import { 
  actionChangeInn, 
  loadCompanyInfo, 
  clearCompanyInfo,
  decodedCompanyResponse, 
  decodedRenderData, 
  decodedInn,
  decodedErrors
} from "../../../../store/ducks/openBill"
import { 
  actionChangeInn as ebgActionChangeInn, 
  loadCompanyInfo as ebgLoadCompanyInfo, 
  clearCompanyInfo as ebgClearCompanyInfo,
  decodedCompanyResponse as ebgCompanyResponse, 
  decodedRenderData as ebgRenderData, 
  decodedInn as ebgInn,
  decodedErrors as ebgErrors
} from "../../../../store/ducks/electronicBankGarantees"

const Container = props => <SearchCompanyInput {...props}/>

const putStateToProps = state => {
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      companyResponse: ebgCompanyResponse(state),
      renderData: ebgRenderData(state),
      inn: ebgInn(state), 
      errors: ebgErrors(state).get("companyMainInfoUpdate")
    }
  }
  return {
    companyResponse: decodedCompanyResponse(state),
    renderData: decodedRenderData(state),
    inn: decodedInn(state), 
    errors: decodedErrors(state).get("companyMainInfoUpdate")
  }
}

const putActionsToProps = () => {
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      actionChangeInn: ebgActionChangeInn,
      loadCompanyInfo: ebgLoadCompanyInfo,
      clearCompanyInfo: ebgClearCompanyInfo
    }
  }
  return {
    actionChangeInn,
    loadCompanyInfo,
    clearCompanyInfo
  }
}

export default connect(putStateToProps, putActionsToProps)(Container)
