import React, { PureComponent } from 'react'
import config from './../../../config'
import "./early-warning-system.scss"

class EarlyWarningSystem extends PureComponent {

  componentDidMount() {
    document.title = "AC - Проверка | Система раннего предупреждения"
  }

  render() {
    return(
      <div>
        { <iframe src={`${config.api()}/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_interface.pl`} title="early-warning-system" width="100%" height="890px"></iframe> }
      </div>
    )
  }
}

export default EarlyWarningSystem