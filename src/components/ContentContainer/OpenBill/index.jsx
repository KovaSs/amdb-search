import React, { Component } from 'react'
import "./open-bill.scss"

class OpenBill extends Component {
  render() {
    return(
      <div>
        <iframe src="https://10.96.205.191/cgi-bin/serg/0/6/9/reports/276/konttur_focus_viewer_new2.pl" title="open-bill" width="100%" height="890px"></iframe>
      </div>
    )
  }
}

export default OpenBill