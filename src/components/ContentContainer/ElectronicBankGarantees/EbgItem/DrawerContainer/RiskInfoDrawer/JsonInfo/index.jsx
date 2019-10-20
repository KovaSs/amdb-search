import React from 'react'
import { connect } from "react-redux"
import Inspector from "react-inspector"
import { decodedEbgMainResponse } from "../../../../../../../store/ducks/EBG";

const JsonInfo = props => {
  const { ebgData } = props
  return (
    <div style={{ padding : '1rem'}}>
      <Inspector data={ebgData} expandLevel={1} />
    </div>
  )
}

const putStateToProps = state => {
  return {
    ebgData: decodedEbgMainResponse(state),
  }
}

export default connect(putStateToProps)(JsonInfo)
