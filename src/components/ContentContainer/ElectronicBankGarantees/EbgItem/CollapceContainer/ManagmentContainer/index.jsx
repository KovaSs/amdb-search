import React from 'react'
import { connect } from "react-redux"
import ManagmentItem from './ManagmentItem'
import FoundersUlItem from './FoundersUlItem'
import PropTypes from 'prop-types'
import AddNewUser from "./AddNewUser";
import { 
  decodedRequestLoading,
  ebgHeads,
  ebgFoundersUl,
  decodedErrors,
  decodedCompanyName,
  decodedCompanySrc,
  identifyUser,
  updateUserSelectedInfo,
  actionGetUserCroinformInfo,
  addNewUserToCheackList,
  storeRiskFactors,
  storeTimeRequest,
  storeStopLists,
  storeIdentifyInfoFl,
  storeSelectedInfoFl,
  storeCroinformInfoFl,
  storeFsspInfo,
  storeRisksSrc,
  downloadReport
} from "../../../../../../store/ducks/EBG"

/** Вывод данных об руководстве */
const ManagmentContainer = props => {
  const { 
    digets,
    heads,
    companySrc,
    identifyUser,
    updateUserSelectedInfo,
    requestLoading, 
    companyName, 
    actionGetUserCroinformInfo, 
    addUser,
    fsspInfo,
    onSave,
    timeRequest,
    stopLists,
    croinformInfo,
    selectedInfo,
    identifyInfo,
    addNewUserToCheackList,
    foundersUl,
    errors,
    risks,
    downloadReport
  } = props
  if(addUser) {
    const user = {
      ActualDate: Date.now(),
      first_name: "",
      inn: "",
      last_name: "",
      middle_name: "",
      position: ""
    }
    return (
      <AddNewUser 
        key={Date.now()}
        user={user}
        onSave={onSave}
        companySrc={companySrc}
        addUser={addNewUserToCheackList}
      />
    )
  }

  const renderHeads = heads.map( item => (
    <ManagmentItem 
      item={item}
      key={item.id}
      timeRequest={timeRequest.get(item.id, "")}
      fsspInfo={fsspInfo.get(item.id, "")}
      searchData={'heads'}
      risks={risks}
      digets={digets.get(item.id, {digets: [], history: []})}
      stopLists={stopLists.get(item.id)}
      identifyInfo={identifyInfo.get(item.id)}
      selectedInfo={selectedInfo.get(item.id)}
      croinformInfo={croinformInfo.get(item.id)}
      identifyUserloading={requestLoading.getIn(["identifyUser",item.id])}
      croinformRequestloading={requestLoading.getIn(["croinformRequest",item.id])}
      fssploading={requestLoading.getIn(["fsspInfo", item.id], false)}
      actionGetUserCroinformInfo={actionGetUserCroinformInfo}
      updateUserSelectedInfo={updateUserSelectedInfo}
      identifyUser={identifyUser}
      companyName={companyName}
      downloadReport={downloadReport}
      errors={errors}
    />
  ))

  const renderFoundersUl = foundersUl.map( item => (
    <FoundersUlItem 
      key={item.key}
      item={item}
    />
  ))

  return (
    <>
      {renderHeads}
      {renderFoundersUl}
    </>
  )
}

const putStateToProps = state => {
  return {
    digets: storeRiskFactors(state),
    risks: storeRisksSrc(state),
    timeRequest: storeTimeRequest(state),
    identifyInfo: storeIdentifyInfoFl(state),
    fsspInfo: storeFsspInfo(state),
    stopLists: storeStopLists(state),
    croinformInfo: storeCroinformInfoFl(state),
    selectedInfo: storeSelectedInfoFl(state),
    requestLoading: decodedRequestLoading(state),
    companySrc: decodedCompanySrc(state),
    heads: ebgHeads(state),
    foundersUl: ebgFoundersUl(state),
    companyName: decodedCompanyName(state),
    errors: decodedErrors(state)
  }
}

const putActionsToProps = {
  identifyUser,
  updateUserSelectedInfo,
  actionGetUserCroinformInfo,
  addNewUserToCheackList,
  downloadReport
}

export default connect(putStateToProps, putActionsToProps)(ManagmentContainer)

/** Передаваемые в компонент props */
ManagmentItem.propTypes = {
  // Данные о руководящем составе
  managementSource: PropTypes.shape({
    heads: PropTypes.array,
    management_companies: PropTypes.array,
    founders_fl: PropTypes.array,
    founders_ul: PropTypes.array,
    befenicials: PropTypes.array
  }),
  // Action для первичной идентификации проверяемого лица
  identifyUser: PropTypes.func.isRequired,
  // Action для проверки проверяемого лица с помощью Croinform
  actionGetUserCroinformInfo: PropTypes.func.isRequired,
  // Информация для отображения Loader cocтояния
  requestLoading: PropTypes.object
}
