import React, { Component } from 'react';
import TableContainer from './TableContainer';
import "./elsecronic-bank-garantees.scss";

class ElectronicBankGarantees extends Component {

  componentDidMount() {
    document.title = "AC - Проверка | Электронные банковские гарантии"
  }

  render() {
    return(
      <div className="bank-garanties-container">
        <TableContainer />
      </div>
    )
  }
}

export default ElectronicBankGarantees