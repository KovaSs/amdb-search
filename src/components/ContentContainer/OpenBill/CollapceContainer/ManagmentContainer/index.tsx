import React from 'react'
import { connect } from "react-redux"
import ManagmentItem from './ManagmentItem'
import AddNewUser from "./AddNewUser";
import { actions, sl } from "../../../../../store/ducks/openBill";

interface OwnProps {
  // TODO Дописать типы передаваемых переменных
  heads: any;
  digets: any;
  companySrc: any;
  companyName: any; 
  addUser: any;
  fsspInfo: any;
  onSave: any;
  timeRequest: any;
  stopLists: any;
  croinformInfo: any;
  selectedInfo: any;
  identifyInfo: any;
  errors: any;
  addNewUserToCheackList: any;
  // Данные о руководящем составе
  managementSource: {
    heads: any[];
    management_companies: any[];
    founders_fl: any[];
    founders_ul: any[];
    befenicials:any[];
  };
  // Информация для отображения Loader cocтояния
  requestLoading: object;
}

interface DispatchProps {
  identifyUser(): void;
  updateUserSelectedInfo(): void;
  actionGetUserCroinformInfo(): void;
  addNewUserToCheackList(): void;
  downloadReport(): void;
}

type Props = OwnProps & DispatchProps;

/** Вывод данных об руководстве */
const ManagmentContainer: React.FC<Props> = props => {
  const {
    heads,
    digets,
    companySrc,
    companyName, 
    addUser,
    fsspInfo,
    onSave,
    timeRequest,
    stopLists,
    croinformInfo,
    selectedInfo,
    identifyInfo,
    errors,
    addNewUserToCheackList,
    requestLoading, 
    identifyUser,
    updateUserSelectedInfo,
    actionGetUserCroinformInfo, 
    downloadReport,
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
      digets={digets.get(item.id, {digets: [], history: []})}
      stopLists={stopLists.get(item.id)}
      identifyInfo={identifyInfo.get(item.id)}
      selectedInfo={selectedInfo.get(item.id)}
      croinformInfo={croinformInfo.get(item.id)}
      identifyUserloading={requestLoading.getIn(["identifyUser",item.id])}
      croinformRequestloading={requestLoading.getIn(["croinformRequest",item.id])}
      fssploading={requestLoading.getIn(["fsspInfo",item.id])}
      companyName={companyName}
      errors={errors}
      downloadReport={downloadReport}
      actionGetUserCroinformInfo={actionGetUserCroinformInfo}
      updateUserSelectedInfo={updateUserSelectedInfo}
      identifyUser={identifyUser}
    />
  ))

  return <>{renderHeads}</>
}

const putStateToProps = state => {
  return {
    heads: sl.ebgHeads(state),
    digets: sl.storeRiskFactors(state),
    timeRequest: sl.storeTimeRequest(state),
    identifyInfo: sl.storeIdentifyInfoFl(state),
    fsspInfo: sl.storeFsspInfo(state),
    stopLists: sl.storeStopLists(state),
    croinformInfo: sl.storeCroinformInfoFl(state),
    selectedInfo: sl.storeSelectedInfoFl(state),
    requestLoading: sl.decodedRequestLoading(state),
    companySrc: sl.decodedCompanySrc(state),
    companyName: sl.decodedCompanyName(state),
    errors: sl.decodedErrors(state)
  }
}

const putActionsToProps = {
  identifyUser: actions.identifyUser,
  updateUserSelectedInfo: actions.updateUserSelectedInfo,
  actionGetUserCroinformInfo: actions.actionGetUserCroinformInfo,
  addNewUserToCheackList: actions.addNewUserToCheackList,
  downloadReport: actions.downloadReport
}

export default connect(putStateToProps, putActionsToProps)(ManagmentContainer)
