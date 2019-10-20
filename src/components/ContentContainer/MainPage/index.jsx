import React, { Component } from 'react'
import "./main-page.scss"

class OpenAnAccount extends Component {

  componentDidMount() {
    document.title = "AC - Проверка"
  }

  render() {
    return(
      <div className="main-page">
        <img style={{width: "40%"}} src={process.env.PUBLIC_URL + '/img/logo_big.png'} alt={"logo-gazprombank"} />
      </div>
    )
  }
}

export default OpenAnAccount