import React from 'react'
import { Button, Icon, Popconfirm } from 'antd'
import { connect } from "react-redux"
import {
  ebgHeads,
  deleteRiskUlFactor,
  deleteRiskFactorFl,
  editRiskFactorFl,
  editRiskFactorUl,
  storeUlSource
} from "../../../../../../store/ducks/EBG";

/** Функционал удаления риск-факторов */
const Btn = props => {
  const {
    heads,
    deleteRiskFactorFl,
    deleteRiskUlFactor,
    factor,
    ulSrc
  } = props

  // Удаление риск-фактора ЮЛ
  const deleteFactorUl = () => {
    const ulInfo = ulSrc.find(ulItem => ulItem.get("name") === factor.name).toJS()
    deleteRiskUlFactor({ delete: factor.id }, 
      {
        inn: ulInfo.inn, 
        id: ulInfo.key,
        storeCompName: ulInfo.name,
        reqnum: ulInfo.reqnum
      }
    )
  }

  // Удаление риск-фактора ФЛ
  const deleteFactorFl = () =>  {
    const flInfo = heads.find(item => factor.object.indexOf(item.fio) !== -1)
    deleteRiskFactorFl({
      SurName: flInfo.last_name,
      FirstName: flInfo.first_name,
      MiddleName: flInfo.middle_name,
      INN: flInfo.inn ? flInfo.inn : "",
      t_user_request_risk_id: factor.kod,
      risk1: factor.comment,
      rowid: factor.id
    }, flInfo.id)
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
      onConfirm={ factor.isFl ? deleteFactorFl : deleteFactorUl }
      icon={<Icon type="question-circle-o" style={{color: "red"}}/>}
      placement="left"
      okText="Да"
      cancelText="Нет" 
    >
      <Button icon="delete" type="danger" />
    </Popconfirm>
  )
}

/** Функционал редактирования риск-факторов */
const BtnEdit = props => {
  const {
    heads,
    editRiskFactorFl,
    canselEdit,
    changedComment,
    checkType,
    editRiskFactorUl,
    factor,
    ulSrc
  } = props

  // Редактирование риск-фактора ЮЛ
  const editFactorUl = () =>  {
    const ulInfo = ulSrc.find(ulItem => ulItem.get("name") === factor.name).toJS()
    editRiskFactorUl({ 
      edit: factor.id,
      check_type: checkType,
      comment: changedComment 
    },
    {
      inn: ulInfo.inn, 
      id: ulInfo.key,
      storeCompName: ulInfo.name,
      reqnum: ulInfo.reqnum
    })
    canselEdit()
  }

  // Редактирование риск-фактора ФЛ
  const editFactorFl = () =>  {
    const user = heads.find(item => factor.name.indexOf(item.fio) !== -1)
    editRiskFactorFl({
      SurName: user.last_name,
      FirstName: user.first_name,
      MiddleName: user.middle_name,
      INN: user.inn !== "Не найден" ? user.inn : "",
      check_type: checkType,
      t_user_request_risk_id: factor.kod,
      risk1: changedComment,
      rowid: factor.id
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

  return (
    <> 
      <Popconfirm
        title={PopTitleConfirm}
        onConfirm={factor.isFl ? editFactorFl : editFactorUl}
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
    heads: ebgHeads(state),
    ulSrc: storeUlSource(state),
  }
}
const putActionsToProps = {
  deleteRiskFactorFl,
  editRiskFactorFl,
  deleteRiskUlFactor,
  editRiskFactorUl
}

const ConnectedBtn = connect(putStateToProps, putActionsToProps)(Btn)
const ConnectedBtnEdit = connect(putStateToProps, putActionsToProps)(BtnEdit)

export {
  ConnectedBtn as Btn,
  ConnectedBtnEdit as BtnEdit,
} 