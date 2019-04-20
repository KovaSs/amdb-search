import React from 'react'
import { connect } from "react-redux";
import { actionChangeInn, actionChangeOgrn } from "../../../../store/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput store={props}/>

const putStateToProps = state => {
  const {creditConveyor : {inn, ogrn}} = state
  return {
    inn,
    ogrn
  }
}
const putActionsToProps =  {
    actionChangeInn,
    actionChangeOgrn
}

export default connect(putStateToProps, putActionsToProps)(Container)
