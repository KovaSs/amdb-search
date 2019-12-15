import React from 'react'
import { Button, Icon, Popconfirm } from 'antd'
import { connect } from "react-redux"
import { actions, sl } from "../../../../../store/ducks/openBill";

interface OwnProps {
  digetsFl: any;
  userFl: boolean;
  factor: {
    id: string;
    object: string;
    kod: string;
    comment: string;
  }
}

interface StoreProps {
  companyResponse: {
    name: string;
    heads: any[];
  };
}

interface DispatchProps {
  deleteRiskFactor(riskFaktor: object): void;
  deleteRiskFactorFl(riskFaktor: object, riskId: string): void;
  editRiskFactor(riskFaktor: object): void;
  editRiskFactorFl(riskFaktor: object, riskId: string): void;
}

type Props = OwnProps & StoreProps & DispatchProps

/** Функционал удаления риск-факторов */
const Btn: React.FC<Props> = props => {
  const {
    companyResponse: {name, heads},
    digetsFl,
    deleteRiskFactor,
    deleteRiskFactorFl,
    userFl
  } = props

  // Удаление риск-фактора ЮЛ
  const deleteFactor = () =>  deleteRiskFactor({ delete: props.factor.id })

  // Удаление риск-фактора ФЛ
  const deleteFactorFl = () =>  {
    const user = userFl ? userFl : heads.filter(item => props.factor.object.indexOf(item.fio) !== -1)[0]
    deleteRiskFactorFl({
      SurName: user.last_name,
      FirstName: user.first_name,
      MiddleName: user.middle_name,
      INN: user.selectedInfo && user.selectedInfo.INN ? user.selectedInfo.INN : user.inn !== "Не найден" ? user.inn : "",
      t_user_request_risk_id: props.factor.kod,
      risk1: props.factor.comment,
      rowid: props.factor.id
    }, user.id)
  }

  const PopTitle = (
    <div style={{width: 200}}>
      <div style={{fontWeight: 500}}> Удалить риск-фактор? </div>
      <div> После подтверждения, выбранный риск фактор будет безвозвратно удален </div>
    </div>
  )

  return (
    <Popconfirm
      title={PopTitle}
      onConfirm={digetsFl ? deleteFactorFl : props.factor.object && props.factor.object.indexOf(name) !== -1 ? deleteFactor : deleteFactorFl}
      icon={<Icon type="question-circle-o" style={{color: "red"}}/>}
      placement="leftTop"
      okText="Да"
      cancelText="Нет" 
    >
      <Button icon="delete" type="danger" />
    </Popconfirm>
  )
}

interface BtnEditOwnProps {
  // TODO add real types
  changedComment: any;
  checkType: any;
  digetsFl: any;

  userFl: boolean;
  factor: {
    id: string;
    object: string;
    kod: string;
    comment: string;
  }
  canselEdit(): any;
}

type BtnEditProps = BtnEditOwnProps & StoreProps & DispatchProps

/** Функционал редактирования риск-факторов */
const BtnEdit: React.FC<BtnEditProps> = props => {
  const {
    companyResponse: {
      name, 
      heads
    },
    editRiskFactor,
    editRiskFactorFl,
    canselEdit,
    changedComment,
    checkType,
    digetsFl,
    userFl
  } = props

  // Редактирование риск-фактора ЮЛ
  const editFactor = () =>  {
    editRiskFactor({ 
      edit: props.factor.id,
      check_type: checkType,
      comment: changedComment 
    })
    canselEdit()
  }

  // Редактирование риск-фактора ФЛ
  const editFactorFl = () =>  {
    const user = userFl ? userFl : heads.filter(item => props.factor.object.indexOf(item.fio) !== -1)[0]
    editRiskFactorFl({
      SurName: user.last_name,
      FirstName: user.first_name,
      MiddleName: user.middle_name,
      INN: user.inn !== "Не найден" ? user.inn : "",
      check_type: checkType,
      t_user_request_risk_id: props.factor.kod,
      risk1: changedComment,
      rowid: props.factor.id
    }, user.id)
    canselEdit()
  }

  const PopTitleConfirm = (
    <div style={{width: 200}}>
      <div style={{fontWeight: 500}}> Сохранить изменения? </div>
      <div> После подтверждения, внесенные изменения будут сохранены </div>
    </div>
  )
  const PopTitleCancel = (
    <div style={{width: 200}}>
      <div style={{fontWeight: 500}}> Отменить изменения? </div>
      <div> После подтверждения, внесенные изменения будут отменены </div>
    </div>
  )

  const edit = digetsFl ? editFactorFl : props.factor.object && props.factor.object.indexOf(name) !== -1 ? editFactor : editFactorFl

  return (
    <> 
      <Popconfirm
        title={PopTitleConfirm}
        onConfirm={() => edit()}
        icon={<Icon type="question-circle-o" style={{color: "#52c41a"}}/>}
        placement="left"
        okText="Да"
        cancelText="Нет" 
        disabled={!changedComment}
      >
        <Button icon="check" style={{ marginBottom: 10, color: "#52c41a" }} disabled={!changedComment}/>
      </Popconfirm>
      <Popconfirm
        title={PopTitleCancel}
        onConfirm={() => canselEdit()}
        icon={<Icon type="question-circle-o" style={{color: "red"}}/>}
        placement="left"
        okText="Да"
        cancelText="Нет" 
      >
        <Button 
          icon="close"
          style={{color: "red"}}
        />
      </Popconfirm>
    </>
  )
}

const putStateToProps = state => {
  return {
    companyResponse: sl.decodedCompanyResponse(state),
  }
}
const putActionsToProps = {
  deleteRiskFactor: actions.deleteRiskFactor,
  deleteRiskFactorFl: actions.deleteRiskFactorFl,
  editRiskFactor: actions.editRiskFactor,
  editRiskFactorFl: actions.editRiskFactorFl
}

const ConnectedBtn = connect(putStateToProps, putActionsToProps)(Btn)
const ConnectedBtnEdit = connect(putStateToProps, putActionsToProps)(BtnEdit)

export {
  ConnectedBtn as Btn,
  ConnectedBtnEdit as BtnEdit,
} 