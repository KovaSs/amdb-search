import React from 'react'
import { connect } from "react-redux"
import ManagmentItem from './ManagmentItem'
import PropTypes from 'prop-types'
import { trasform } from "../../../../../services/utils";
import AddNewUser from "./AddNewUser";
import store from "../../../../../store"
import { 
  decodedRequestLoading, 
  decodedManagementSource, 
  identifyUser, 
  decodedCompanyName, 
  actionGetUserCroinformInfo,
  decodedСroinformResponse,
  addNewUserToCheackList,
  decodedErrors,
  decodedFsspInfo
} from "../../../../../store/ducks/openBill";
import { 
  decodedRequestLoading as ebgRequestLoading, 
  decodedManagementSource as ebgManagementSource, 
  identifyUser as ebgIdentifyUser, 
  decodedCompanyName as ebgCompanyName, 
  actionGetUserCroinformInfo as ebgActionGetUserCroinformInfo,
  decodedСroinformResponse as ebgСroinformResponse,
  addNewUserToCheackList as ebgAddNewUserToCheackList,
  decodedErrors as ebgErrors,
  decodedFsspInfo as ebgFsspInfo
} from "../../../../../store/ducks/electronicBankGarantees";

/** Вывод данных об руководстве */
const ManagmentContainer = props => {
  const { 
    managementSource, 
    identifyUser, 
    requestLoading, 
    companyName, 
    actionGetUserCroinformInfo, 
    croinformResponse, 
    addUser, 
    onSave,
    fsspInfo,
    addNewUserToCheackList,
    errors
  } = props
  if(addUser) {
    const user = {
      ActualDate: Date.now(),
      first_name: "Имя",
      inn: "ИНН",
      last_name: "Фамилия",
      middle_name: "Отчество",
      position: "Должность"
    }
    return (
      <AddNewUser 
        key={Date.now()}
        user={user}
        onSave={onSave}
        addUser={addNewUserToCheackList}
      />
    )
  }

  const managementInfo = trasform._managementSource(managementSource)
  const heads = managementInfo.find( item => item.id === 'heads');

  const renderHeads = heads.data.map( item => (
    <ManagmentItem 
      key={item.id} 
      item={item} 
      searchData={'heads'}
      errors={errors}
      actionGetUserCroinformInfo={actionGetUserCroinformInfo}
      identifyUser={identifyUser}
      companyName={companyName}
      fsspInfo={fsspInfo.get(item.id)}
      identifyUserloading={requestLoading.getIn(["identifyUser",item.id])}
      croinformRequestloading={requestLoading.getIn(["croinformRequest",item.id])}
      fssploading={requestLoading.getIn(["fsspInfo",item.id])}
      croinformRes={croinformResponse.get(item.id)}
    />
  ))

  return <>{renderHeads}</>
}

const putStateToProps = state => {
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      requestLoading: ebgRequestLoading(state),
      managementSource: ebgManagementSource(state),
      companyName: ebgCompanyName(state),
      croinformResponse: ebgСroinformResponse(state),
      errors: ebgErrors(state),
      fsspInfo: ebgFsspInfo(state)
    }
  }
  return {
    requestLoading: decodedRequestLoading(state),
    managementSource: decodedManagementSource(state),
    companyName: decodedCompanyName(state),
    croinformResponse: decodedСroinformResponse(state),
    errors: decodedErrors(state),
    fsspInfo: decodedFsspInfo(state)
  }
}

const putActionsToProps = () => {
  if(store.getState().router.location.pathname.indexOf("electronic-bank-garantees/") !== -1) {
    return {
      identifyUser: ebgIdentifyUser,
      actionGetUserCroinformInfo: ebgActionGetUserCroinformInfo,
      addNewUserToCheackList: ebgAddNewUserToCheackList
    }
  }
  return {
    identifyUser,
    actionGetUserCroinformInfo,
    addNewUserToCheackList
  }
}

export default connect(putStateToProps, putActionsToProps)(ManagmentContainer)

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
