import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";

const Container = props => <CollapceContainer store={props}/>

const putStateToProps = state => {
  const {creditConveyor : {companyResponse}} = state
  return {
    companyResponse
  }
}

export default connect(putStateToProps)(Container)
