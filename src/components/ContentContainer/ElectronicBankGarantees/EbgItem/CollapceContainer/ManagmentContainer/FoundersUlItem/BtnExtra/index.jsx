import React from 'react'
import { connect } from "react-redux"
import { Button, Badge, Icon } from 'antd'
import { 
  decodedRequestLoading,
  decodedErrors,
  ebgRiskSource,
  storeRiskFactors,
  loadingFoundersUl
} from "../../../../../../../../store/ducks/EBG"

const styleCss = {
  bange: {
    backgroundColor: "#e6f7ff",
    color: "#1890ff",
    boxShadow: "0 0 0 1px #91d5ff inset"
  }
}

const BtnExtra = props => {
  const { 
    onAction : {showDrawer}, 
    requestLoading,
    icon, 
    disabled, 
    digets, 
    keyId
  } = props

  const loading = requestLoading.getIn(["digestListUl", keyId], false)

  return (
    <span className="heads-search-panel" style={{width: 44}}>
      <Badge 
        style={!loading ? styleCss.bange : null} 
        count={
          loading ? 
          <Icon type="sync" className="badge-icon-count" spin/> :
          digets.digets && digets.digets.length
        }
        offset={[-6,1]} 
        overflowCount={99}
      >
        <Button
          title="Риск-факторы"
          size="small"
          icon={icon}
          style={{color: disabled ? "gray" : "#0e75fdfd"}}
          onClick={e => showDrawer(e)}
          disabled={disabled}
        />
      </Badge>
    </span>
  );
};

const putStateToProps = (state, props) => {
  return {
    requestLoading: decodedRequestLoading(state),
    digets: storeRiskFactors(state).get(props.keyId, {digets: [], history: []}),
    foundersUlloading: loadingFoundersUl(state, props.keyId),
    errors: decodedErrors(state),
    riskSource: ebgRiskSource(state, props.key)
  }
}

export default connect(putStateToProps)(BtnExtra)