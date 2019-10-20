import React, { Component } from 'react'
import { connect } from "react-redux"
import Inspector from "react-inspector"
import { decodedEbgMainResponse } from "../../../../store/ducks/EBG";
// import { ul } from "../mock/json/request_ul";

export class ObjectRequestItem extends Component {
  render() {
    const { ebgData } = this.props
    return (
      <div style={{ padding : '1rem'}}>
        <Inspector data={ebgData} expandLevel={666} />
      </div>
    )
  }
}

const putStateToProps = state => {
  return {
    ebgData: decodedEbgMainResponse(state),
  }
}

export default connect(putStateToProps)(ObjectRequestItem)
