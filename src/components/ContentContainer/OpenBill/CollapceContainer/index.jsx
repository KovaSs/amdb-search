import React from 'react'
import { connect } from "react-redux";
import { CollapceContainer } from "./CollapceContainer";

const Container = props => <CollapceContainer {...props}/>

const putStateToProps = state => {
  const { openBill : { companyResponse } } = state
  const { heads, management_companies, founders_fl, founders_ul, befenicials, arbiter, fns, inn, ogrn, name, full_name, sanctions, isponlit_proizvodstva, ...companySource} = companyResponse
  const riskSource = { arbiter, fns, sanctions, isponlit_proizvodstva }
  const managementSource = { heads, management_companies, founders_fl, founders_ul, befenicials }
  return {
    companySource,
    riskSource,
    managementSource
  }
}

export default connect(putStateToProps)(Container)
