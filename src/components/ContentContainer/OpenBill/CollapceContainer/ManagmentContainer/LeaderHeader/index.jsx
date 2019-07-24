import React from 'react'
import { Tag, Popover, Badge } from 'antd'
import { getDate, uuid, sumTrans } from '../../../../../../services/utils'

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
    },
    rowTitle: {
      fontWeight: 600
    },
    text: {
      color: "red"
    },
    rowKey: {
      fontWeight: 600,
      marginTop: 5
    }
  },
  tagInfo: {
    borderTop: "1px #d9d9d9 solid"
  }
}

/** Рендеринг header title физического лица */
const LeaderHeader = props => {
  const { 
    item: {first_name, last_name, middle_name, position, ActualDate, inn, organisation, stop_lists}, 
    companyName,
    fssp,
    croinformRes = {},
    userSelected : {FirstName, MiddleName, SurName, inn: INN }
  } = props

  const renderPositionTag = (tagTitle = "") => {
    if(Array.isArray(position)) return position.map((tag, index )=> {
      switch (tag.tagName) {
        case "Акционер":
          tagTitle = `${tag.tagName}${tag.share.hasOwnProperty('capitalSharesPercent') ? ` (${tag.share.capitalSharesPercent} / ${tag.share.capitalSharesPercent})` : ""}`
          break;
        case "Учредитель":
          tagTitle = `${tag.tagName}${tag.share.hasOwnProperty('sum') ? ` (${sumTrans(tag.share.sum)})` : ""}`
          break;
        default:
          tagTitle = tag.tagName
      }
      const content = (
        <div style={styleCss.popover}> 
          <div>Организация: {tag.organisation.name}</div>
          <div>ИНН: {tag.organisation.inn}</div>
          <div>ОГРН: {tag.organisation.ogrn}</div>
          {
            tag.organisation.hasOwnProperty('share') && tag.organisation.share.hasOwnProperty('sum') && tag.organisation.share.sum ?
            <div style={styleCss.tagInfo}> {`Учредитель владеет: ${sumTrans(tag.organisation.share.sum)}`} </div> : null
          }
        </div>
      )
      if(tag !== "") return (
      <Popover key={index} title={tagTitle} content={content} trigger="hover" style={styleCss.popover}>
        <Tag key={uuid()} color="blue" >{tagTitle}</Tag>
      </Popover>
      )
      else return null
    })
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
        const renderRowsItem = (list, i, arr = []) => {
          arr.push(<div key={uuid()} style={styleCss.stopList.rowKey}>{`Запись №${i+1}: `}</div>)
          for (const key in list) {
            if (list.hasOwnProperty(key) && list[key] !== "-" && list[key] !== "" && list[key] !== null && list[key] !== "!^!  \r") {
              arr.push(
                <div key={uuid()} >
                  <label>{`${key} : `}</label>
                  <label style={{color: "red"}}>{list[key]}</label>
                </div>
              )
            }
          }
          return arr
        }
        const content = 
          <div style={styleCss.popover}>
            {
              stopLists.map((item, index) => {
                return (
                  <div key={index}>
                    <label style={styleCss.stopList.rowTitle}> {`${item.report_name ? item.report_name : ""} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""}`}</label>
                    { item.rows.map((list, i) =>
                      <div key={i}>
                        { renderRowsItem(list, i) }
                      </div>
                      )
                    }
                  </div>
                )
              })
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
    if(fssp && fssp.length) {
      const content = (
        <div style={styleCss.popover}>
          {
            fssp.indexOf("По вашему запросу ничего не найдено") === -1 ?
            <div>Данные из ФССП получены</div> : <div>Данные в ФССП отсутствуют</div>
          }
        </div>)
      arr.push(
        <Popover key="fssp" title="Данные из ФССП" content={content} trigger="hover" style={styleCss.popover}>
          <Tag color="purple" > ФССП </Tag> 
        </Popover>
      )
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
      <label className="leader-name-header_position" onClick={e => e.stopPropagation(e)}>
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