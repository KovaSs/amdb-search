import React from 'react'
import { Tag, Popover, Badge } from 'antd'
import { getDate, uuid } from '../../../../../../services/utils'

const styleCss = {
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto"
  },
  bange: {
    cyan: {
      backgroundColor: "#e6fffb",
      color: "#13c2c2",
      boxShadow: "0 0 0 1px #87e8de inset"
    },
    volcano: {
      backgroundColor: "#fff2e8",
      color: "#fa541c",
      boxShadow: "0 0 0 1px #ffbb96 inset"
    },
    red: {
      backgroundColor: "rgb(255, 241, 240)",
      color: "#f5222d",
      boxShadow: "0 0 0 1px #ffa39e inset"
    }
  },
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    }
  }
}

/** Рендеринг header title физического лица */
const LeaderHeader = props => {
  const { 
    item: {first_name, last_name, middle_name, position, ActualDate, inn, organisation, stop_lists}, 
    companyName,
    croinformRes = {},
    userSelected : {FirstName, MiddleName, SurName, inn: INN }
  } = props

  const renderPositionTag = () => {
    if(Array.isArray(position)) return position.map(item => {
      if(item !== "") return <Tag key={uuid()} color="blue" >{item}</Tag>
      else return null
    })
    return <Tag color="blue" >{position}</Tag>
  }

  const renderStopListInfo = (arr =[]) => {
    const vector = croinformRes.vector ? croinformRes.vector : []
    const lists = croinformRes.lists ? croinformRes.lists : []
    if(vector.length) {
      const content = <div style={styleCss.popover}>{vector.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="vector" title="Найден в списках" content={content} trigger="hover" >
          <Badge count={vector.length} offset={[-9,1]} style={styleCss.bange.cyan}>
            <Tag color="cyan" > Вектор заемщика </Tag> 
          </Badge>
        </Popover>
      )
    }
    if(lists.length) {
      const content = <div style={styleCss.popover}>{lists.map((item, index) => <div key={index} >{item}</div>)}</div>
      arr.push(
        <Popover key="lists" title="Найден в списках" content={content} trigger="hover" style={styleCss.popover}>
          <Badge count={lists.length} offset={[-9,1]} style={styleCss.bange.volcano}>
            <Tag color="volcano" > Списки </Tag> 
          </Badge>
        </Popover>
      )
    }

    try {
      const stopLists = stop_lists ? stop_lists : []
      if(stopLists.length) {
        const content = 
          <div style={styleCss.popover}>
            {
              stopLists.map((item, index) => 
                <div key={index} >
                  { item.rows.map((list, i) =>
                    <div key={i}>
                      <label style={styleCss.stopList.title}> {`${list.HOW}`} </label>
                      <label> {`( ${list.comment} )`} </label>
                    </div>
                    )
                  }
                </div>
              )
            }
          </div>
        arr.push(
          <Popover key="stop-lists" title="Найден в стоп-листах" content={content} trigger="hover" >
            <Badge count={stopLists.length} offset={[-9,1]} style={styleCss.bange.red}>
              <Tag color="red" > Стоп-листы </Tag> 
            </Badge>
          </Popover>
        )
      }
    } catch (error) {
      console.log('Stop lists', error)
    }

    return arr
  }


  return (
    <div className="leader-name-header">
      <label className="leader-name-header_fio">
        {`${SurName ? SurName : last_name} ${FirstName ? FirstName : first_name} ${MiddleName ? MiddleName : middle_name}`}
      </label>
      <label className="leader-name-header_position">
        {INN ? INN : inn}
      </label>
      <label className="leader-name-header_position">
        { renderPositionTag() }
      </label>
      <label className="leader-name-header_position">
        {`${organisation ? organisation.name : companyName}`}
      </label>
      <label className="leader-name-header_date">
        { getDate(ActualDate) }
      </label>
      <label className="leader-name-header_date" onClick={e => e.stopPropagation(e)}>
        { renderStopListInfo() }
      </label>
    </div>
  )
}

export default LeaderHeader