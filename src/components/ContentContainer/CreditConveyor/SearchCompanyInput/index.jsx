import React from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionChangeInn, actionChangeOgrn } from "../../../../store/creditConveyor/actions";
import SearchCompanyInput from "./SearchCompanyInput";

const Container = props => <SearchCompanyInput store={props}/>

const putStateToProps = state => {
  const {creditConveyor : {inn, ogrn}} = state
  return {
    inn,
    ogrn
  }
}
const putActionsToProps = dispatch => {
  return {
    actionChangeInn : bindActionCreators(actionChangeInn, dispatch),
    actionChangeOgrn : bindActionCreators(actionChangeOgrn, dispatch)
  }
}

export default connect(putStateToProps, putActionsToProps)(Container)
