import React, { Component } from 'react'
import "./open-bill.scss"

class OpenAnAccount extends Component {

  componentDidMount() {
    document.title = "AC - Проверка"
  }

  render() {
    return(
      <div style={{textAlign: "center"}}>
        Главная страница!
      </div>
    )
  }
}

export default OpenAnAccount