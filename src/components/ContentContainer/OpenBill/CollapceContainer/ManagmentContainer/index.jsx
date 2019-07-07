import React from 'react'
import { connect } from "react-redux"
import ManagmentItem from './ManagmentItem'
import PropTypes from 'prop-types'
import { trasform } from "../../../../../services/transformData";
import { 
  decodedRequestLoading, 
  decodedManagementSource, 
  identifyUser, 
  decodedCompanyName, 
  actionGetUserCroinformInfo,
  decodedСroinformResponse
} from "../../../../../store/ducks/openBill";

/** Вывод данных об руководстве */
const ManagmentData = ({managementSource, identifyUser, requestLoading, companyName, actionGetUserCroinformInfo, croinformResponse}) => {

  const managementInfo = trasform._managementSource(managementSource)
  const heads = managementInfo.find( item => item.id === 'heads');

  const renderHeads = heads.data.map( item => (
    <ManagmentItem 
      key={item.inn} 
      item={item} 
      activeKey={item.inn} 
      searchData={'heads'}
      actionGetUserCroinformInfo={actionGetUserCroinformInfo}
      identifyUser={identifyUser}
      companyName={companyName}
      identifyUserloading={requestLoading.getIn(["identifyUser",item.inn])}
      croinformRequestloading={requestLoading.getIn(["croinformRequest",item.inn])}
      croinformRes={croinformResponse.get(item.inn)}
    />
  ))

  return <>{renderHeads}</>
}

const putStateToProps = state => {
  return {
    requestLoading: decodedRequestLoading(state),
    managementSource: decodedManagementSource(state),
    companyName: decodedCompanyName(state),
    croinformResponse: decodedСroinformResponse(state)
  }
}

const putActionsToProps = {
  identifyUser,
  actionGetUserCroinformInfo,
}

export default connect(putStateToProps, putActionsToProps)(ManagmentData)

/** Передаваемые в компонент props */
ManagmentItem.propTypes = {
  /** Данные о руководящем составе */
  managementSource: PropTypes.shape({
    heads: PropTypes.array,
    management_companies: PropTypes.array,
    founders_fl: PropTypes.array,
    founders_ul: PropTypes.array,
    befenicials: PropTypes.array
  }),
  /** Action для первичной идентификации проверяемого лица */
  identifyUser: PropTypes.func.isRequired,
  /** Action для проверки проверяемого лица с помощью Croinform */
  actionGetUserCroinformInfo: PropTypes.func.isRequired,
  /** Информация для отображения Loader cocтояния */
  requestLoading: PropTypes.object
}
