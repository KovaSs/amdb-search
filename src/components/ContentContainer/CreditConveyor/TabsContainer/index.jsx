import React from 'react'
import { connect } from "react-redux";
// import { actionChangeInn, actionChangeOgrn } from "../../../../store/actions";
import { TabsContainer } from "./TabsContainer";

const Container = props => <TabsContainer store={props}/>

const putStateToProps = state => {
  const {creditConveyor : {companyResponse}} = state
  return {
    companyResponse
  }
}

export default connect(putStateToProps)(Container)
