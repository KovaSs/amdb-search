import React from 'react'
import { connect } from "react-redux"
import SearchCompanyInput from "./SearchCompanyInput"
import { ebg } from "../../../../services/utils"
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
  return {
    companyResponse: ebg() ? ebgCompanyResponse(state) : decodedCompanyResponse(state),
    renderData: ebg() ? ebgRenderData(state) : decodedRenderData(state),
    inn: ebg() ? ebgInn(state) : decodedInn(state), 
    errors: ebg() ? ebgErrors(state).get("companyMainInfoUpdate") : decodedErrors(state).get("companyMainInfoUpdate")
  }
}

const putActionsToProps = {
  actionChangeInn: ebg() ? ebgActionChangeInn : actionChangeInn,
  loadCompanyInfo: ebg() ? ebgLoadCompanyInfo : loadCompanyInfo,
  clearCompanyInfo: ebg() ? ebgClearCompanyInfo : clearCompanyInfo
}

export default connect(putStateToProps, putActionsToProps)(Container)
