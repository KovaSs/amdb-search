import React from 'react'
import { connect } from "react-redux";
import { TableContainer } from "./TableContainer";

const Container = props => <TableContainer store={props}/>

const putStateToProps = state => {
  const {creditConveyor : {companyResponse}} = state
  return {
    companyResponse
  }
}

export default connect(putStateToProps)(Container)
