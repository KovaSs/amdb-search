import { getTimeAndDate, getDate, trasform, cloCss } from './utils'

/** Формирование HTML отчета по ФЛ */
export const createReportFl = props => {
  // console.log('props', props)
  const { 
    info, 
    identify, 
    croinform, 
    lists, 
    vector, 
    stopLists, 
    fsspInfo, 
    digets,
    risks
  } = props

  console.log('%cgetDocumentsUl@Saga', cloCss.info, props)

  const renderDigets =(arr, text="") => {
    arr.map(item => {
      const parseKod = risks.find(factor => factor.rowid === String(item.t_user_request_risk_id))
      text = text.concat(`
      <tr>
        <td> ${item.time ? getTimeAndDate(item.time) : "Дата записи отсутствует"} </td>
        <td> ${item.user_name ? item.user_name : "Имя пользователя отсутствует"} </td>
        <td class="risks-kod"> ${parseKod ? parseKod.kod : "ФЛ-СБ-23"} </td>
        <td> <div class="risks-comment">${item.risk1}</div> </td>
      </tr>
      `)
      return item
    })
    return `
    <table border="1px" cellpadding="5">
      <caption class="risks-caption">Актуальные на ${getDate(Date.now())} риск-факторы</caption>
      <tr style="background-color: #d3d3d338;">
        <th>Дата записи</th>
        <th>Пользователь</th>
        <th>Код риск-фактора</th>
        <th>Комментарий</th>
      </tr>
      ${text}
    </table>
    `
  }

  const renderArrInfo = (arr, text="") => {
    arr.map(item => text = text.concat(`<div>${item}</div>`))
    return text
  }

  const renderSL = SL => SL.map(item => {
    const renderRowsItem = (list, i, text = "") => {
      text = text.concat(`<div style="font-weight: 600">${`Запись ${i+1}: `}</div>`)
      for (const key in list) {
        text = text.concat(
          `<div>
            <label>${`${key} :`}</label>
            <label style='color: red'>${ list[key]} </label>
          </div>`
        )
      }
      return text
    }
    return (
      `<div>
        <h3 style="color: red; margin: 8px 0;">${item.report_name ? item.report_name : ""} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""} </h3>
        ${ item.rows.map((list, i) => `<div> ${ renderRowsItem(list, i) } </div>` ) }
      </div>`
    )
  })
  return `<!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${info}</title>
    <style type="text/css">
      body {
        padding: 1rem 0 1rem 1rem;
      }
      .ul-menu {
        left: 0;
        top: -1rem;
        width: 100%;
        position: fixed;
        list-style-type: none;
        background-color: #fff;
        padding: 5px;
        box-shadow: 4px 3px 0 #00000017;
        border-radius: 4px;
        display: inline-block;
      }
      .ul-menu li {
        display: inline-block;
        margin: 0 5px;
      }
      .ul-menu label {
        margin-left: 1rem;
      }
      .ul-menu li a {
        text-decoration: none;
      }
      .risks-comment {
        max-width: 700px;
        max-height: 105px;
        overflow-y: auto;
        overflow-x: hidden;
        text-align: left;
        white-space: pre-wrap;
      }
      .risks-kod {
        text-align: center;
      }
      .risks-caption {
        text-align: left;
        margin: 5px;
      }
    </style>
  </head>
  <body>
    <ul class="ul-menu">
      <label>Меню:</label>
      <li><a href="#digets">Риск факторы</a></li>
      <li><a href="#vector">Вектор заемщика</a></li>
      <li><a href="#lists">Списки</a></li>
      <li><a href="#stopLists">Стоп-листы</a></li>
      <li><a href="#identify">Результаты идентификации</a></li>
      <li><a href="#croinform">Результаты финальной проверки</a></li>
      <li><a href="#fsspInfo">Данные ФССП</a></li>
    </ul>
    <a name="digets"></a>
    <h3>Риск факторы</h3>
    ${ digets && digets.length ?  renderDigets(digets) : "<div> Актуальных риск-факторов не выявлено </div>"}
    <h3>Вектор заемщика</h3>
    <a name="vector"></a>
    ${ vector && vector.length ?  renderArrInfo(vector) : "<div> Упоминаний в векторах заемщика не найдено </div>"}
    <a name="lists"></a>
    <h3>Списки</h3>
    ${ lists && lists.length ?  renderArrInfo(lists) : "<div> Упоминаний в списках не найдено </div>"}
    <a name="stopLists"></a>
    <h3>Стоп-листы</h3>
    ${ stopLists && stopLists.length ?  renderSL(stopLists) : "<div> Упоминаний в стоп-листах не найдено </div>"}
    <a name="identify"></a>
    <h3>Результаты идентификации</h3>
    ${ identify ? `<iframe srcdoc="${
        // eslint-disable-next-line
        identify.replace(/\"/gi, "\'")
      }" frameBorder="0" title="crionform-data" width="100%" height="800px" name="identify"></iframe>` : 
      "<div>Идентификация не проводилась</div>"
    }
    <a name="croinform"></a>
    <h3>Результаты финальной проверки</h3>
    ${ croinform ? `<iframe srcdoc="${
        // eslint-disable-next-line
        croinform.replace(/\"/gi, "\'")
      }" frameBorder="0" title="crionform-data" width="100%" height="800px" name="croinform"></iframe>` :
      "<div>Финальная проверка не проводилась</div>"
    }
    <a name="fsspInfo"></a>
    <h3>Данные ФССП</h3>
    ${ fsspInfo ? `<iframe srcdoc="${
        // eslint-disable-next-line
        fsspInfo.replace(/\"/gi, "\'")
      }" frameBorder="0" title="crionform-data" width="100%" height="500px" name="fsspInfo"></iframe>` :
      "<div>Данных по ФССП не найдено</div>"
    }
  </body>
  </html>`
}
/** Формирование HTML отчета по ЮЛ */
export const createReportUl = props => {
  const { 
    info, 
    digets,
    risks,
    headsFl,
    mainDigets,
    identify, 
    croinform, 
    stopLists, 
    fsspInfo,
    riskSource,
    mainKey,
    companyUlRes,
    foundersUl
  } = props

  console.log('%cgetDocumentsUl@Saga', cloCss.info, props)

  const renderDigets =(arr, text="") => {
    arr.map(item => {
      const findKod = risks.find(factor => factor.rowid === String(item.t_user_request_risk_id))
      text = text.concat(`
      <tr>
        <td class="risks-descr"> ${  
          item.vremya_akceptovaniya_zapisi && !item.familia ? 
          getTimeAndDate(item.vremya_akceptovaniya_zapisi) :
          item.time ? getTimeAndDate(item.time) : "Дата записи отсутствует"
        } </td>
        <td class="risks-descr"> ${
          item.user_name ? item.user_name : "Имя пользователя отсутствует"
        } </td>
        <td class="risks-descr"> ${
          item.object ? item.object : "Описание объекта провреки не найдено"
        } </td>
        <td class="risks-kod"> ${
          findKod ? findKod.kod : item.familia ? "ФЛ-СБ-28" : "ЮЛ-СБ-23"
        } </td>
        <td> <div class="risks-comment"> ${
          item.familia ? item.risk1 : item.comment
        } </div> </td>
      </tr>
      `)
      return item
    })
    return `
      <table border="1px" cellpadding="5">
        <caption class="risks-caption">Актуальные на ${getDate(Date.now())} риск-факторы</caption>
        <tr style="background-color: #d3d3d338;">
          <th>Дата записи</th>
          <th>Пользователь</th>
          <th>Объект проверки</th>
          <th>Код риск-фактора</th>
          <th>Комментарий</th>
        </tr>
        ${text}
      </table>
    `
  }

  const renderHeadsFl =(arr, text="") => {
    text = text.concat(`
      <tr style="background-color: #d3d3d338;">
        <th>ФИО</th>
        <th>ИНН</th>
        <th>Должность</th>
        <th>Организация</th>
        <th>Дата актуальности</th>
        <th>Результаты проверки</th>
      </tr>
    `)
    arr.map(item => {
      let position = ""
      item.position.length &&  item.position.map(pos => {
        position = position.concat(`
          <label title='${ `Организация: ${pos.organisation.name}; ИНН: ${pos.organisation.inn}; ОГРН: ${pos.organisation.ogrn}` }'>${pos.tagName}</label><br>
        `)
        return pos
      })
      text = text.concat(`
      <tr>
        <td> ${ item.fio || "Отсутствует" } </td>
        <td> ${ item.inn || "Не найден"} </td>
        <td><div class="position-comment">${ position }</div></td>
        <td><div class="risks-kod"> 
          <div>${ item.organisation.name } </div>
          <small>${ `ИНН: ${item.organisation.inn}` } </small>
          <small>${ `ОГРН: ${item.organisation.ogrn}` } </small>
        </div></td>
        <td><div class="risks-kod"> ${ item.ActualDate } </div></td>
        <td><div class="risks-kod"><a class="risks-kod" href="#response-${item.id}">Посмотреть</a></td>
      </tr>
      `)
      return item
    })
    return  text
  }

  const renderArrInfo = (arr, text="") => {
    arr.map(item => text = text.concat(`<div>${item}</div>`))
    return text
  }

  const renderSL = SL => SL.map(item => {
    const renderRowsItem = (list, i, text = "") => {
      text = text.concat(`<div style="font-weight: 600">${`Запись ${i+1}: `}</div>`)
      for (const key in list) {
        text = text.concat(
          `<div>
            <label>${`${key} :`}</label>
            <label style='color: red'>${ list[key]} </label>
          </div>`
        )
      }
      return text
    }
    return (
      `<div>
        <h3 style="color: red; margin: 8px 0;">${item.report_name ? item.report_name : ""} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""} </h3>
        ${ item.rows.map((list, i) => `<div> ${ renderRowsItem(list, i) } </div>` ) }
      </div>`
    )
  })

  const renderHeadsFlInfo = (arrHeads = [], headsContent = '<h2>Результаты проверки ФЛ:</h2>') => {
    arrHeads.map(head => {
      const digetsContent = digets.has(head.id) && digets.get(head.id).digets.length && digets.get(head.id).digets
      const vectorContent = croinform.has(head.id) && croinform.get(head.id).vector && croinform.get(head.id).vector.length && croinform.get(head.id).vector
      const listsContent = croinform.has(head.id) && croinform.get(head.id).lists && croinform.get(head.id).lists.length && croinform.get(head.id).lists
      const stopListsContent = stopLists.has(head.id) && stopLists.get(head.id).length && stopLists.get(head.id)
      const identifyContent = identify.has(head.id) && identify.get(head.id).html.length && identify.get(head.id).html
      const croinformContent = croinform.has(head.id) && croinform.get(head.id).html.length && croinform.get(head.id).html
      const fsspInfoContent = fsspInfo.has(head.id) && fsspInfo.get(head.id).length && fsspInfo.get(head.id)
      headsContent = headsContent.concat(`
      <div class='divider'>
      <a name="response-${head.id}"></a>
      <h2>${head.fio} ( ${head.inn} )</h2>
      <ul>
        <li><a href="#digets-${head.id}">Риск факторы</a></li>
        <li><a href="#vector-${head.id}">Вектор заемщика</a></li>
        <li><a href="#lists-${head.id}">Списки</a></li>
        <li><a href="#stopLists-${head.id}">Стоп-листы</a></li>
        <li><a href="#identify-${head.id}">Результаты идентификации</a></li>
        <li><a href="#croinform-${head.id}">Результаты финальной проверки</a></li>
        <li><a href="#fsspInfo-${head.id}">Данные ФССП</a></li>
      </ul>
      <a name="digets-${head.id}"></a>
      <h3>Риск факторы</h3>
      ${ digetsContent ?  renderDigets(digetsContent) : "<div> Актуальных риск-факторов не выявлено </div>"}
      <h3>Вектор заемщика</h3>
      <a name="vector-${head.id}"></a>
      ${ vectorContent ?  renderArrInfo(vectorContent) : "<div> Упоминаний в векторах заемщика не найдено </div>"}
      <a name="lists-${head.id}"></a>
      <h3>Списки</h3>
      ${ listsContent ?  renderArrInfo(listsContent) : "<div> Упоминаний в списках не найдено </div>"}
      <a name="stopLists-${head.id}"></a>
      <h3>Стоп-листы</h3>
      ${stopListsContent ?  renderSL(stopListsContent) : "<div> Упоминаний в стоп-листах не найдено </div>"}
      <a name="identify-${head.id}"></a>
      <h3>Результаты идентификации</h3>
      ${ identifyContent ? `<iframe srcdoc="${
          // eslint-disable-next-line
          identify.get(head.id).html.replace(/\"/gi, "\'")
        }" frameBorder="0" title="crionform-data" width="100%" height="800px" name="identify"></iframe>` : 
        "<div>Идентификация не проводилась</div>"
      }
      <a name="croinform-${head.id}"></a>
      <h3>Результаты финальной проверки</h3>
      ${ croinformContent ? `<iframe srcdoc="${
          // eslint-disable-next-line
          croinformContent.replace(/\"/gi, "\'")
        }" frameBorder="0" title="crionform-data" width="100%" height="800px" name="croinform"></iframe>` :
        "<div>Финальная проверка не проводилась</div>"
      }
      <a name="fsspInfo-${head.id}"></a>
      <h3>Данные ФССП</h3>
      ${ fsspInfoContent ? fsspInfoContent.indexOf("По вашему запросу ничего не найдено") !== -1 ? 
        "<div>По данному запросу данных по ФССП не найдено</div>" :
        `<iframe srcdoc="${
          // eslint-disable-next-line
          fsspInfoContent.replace(/\"/gi, "\'")
        }" frameBorder="0" title="crionform-data" width="100%" height="500px" name="fsspInfo"></iframe>` :
        "<div>Запрос данных по ФССП не проводился</div>"
      }
      </div>
      `)
      return head
    })
    return headsContent
  }

  const renderNavMenu = (arrHeads = [], headsNavContent = '') => {
    arrHeads.map(head => {
      headsNavContent = headsNavContent.concat(`
        <li class="menu-item"><a href="#response-${head.id}">${head.fio}</a></li>
      `)
      return head
    })
    return headsNavContent
  }

  const renderNavMenuUl = (arrHeads = [], headsNavContent = '') => {
    arrHeads.map(founder => {
      headsNavContent = headsNavContent.concat(`
        <li class="menu-item"><a href="#responseUl-${founder.key}">${founder.shortName}</a></li>
      `)
      return founder
    })
    return headsNavContent
  }

  const companyRiskSource = (arrRiskSrc = [], riskSrcContent = "<div class='divider'>") => {
    arrRiskSrc.map(item => {
      const {data: itemData} = item
      const renderArrInfo = info => {
        if(Array.isArray(info)) {
          info.map(itemInfo => {
            riskSrcContent = riskSrcContent.concat(`<div style="color: red;">${itemInfo}</div>`)
            return item
          })
        } else {
          riskSrcContent = riskSrcContent.concat(`<div style="color: red;">${info}</div>`)
        }
      }
      
      if(item.id === 'arbiter' && item.data) {
        riskSrcContent = riskSrcContent.concat(`
          <h2>Арбитраж:</h2>
          <table border="1px" cellpadding="5">
            <tr style="background-color: #d3d3d338;">
              <th>Роль</th>
              <th>За 12 месяцев</th>
              <th>За 3 года</th>
            </tr>
            <tr>
              <td class="risks-descr">Истец</td>
              <td class="risks-descr"> ${ itemData.istec.year } </td>
              <td class="risks-descr"> ${itemData.istec.year3 } </td>
            </tr>
            <tr>
              <td class="risks-descr">Ответчик</td>
              <td class="risks-descr"> ${ itemData.otvet.year } </td>
              <td class="risks-descr"> ${ itemData.otvet.year3 } </td>
            </tr>
          </table>
        `)
      } else if (item.id === 'stop_list') {
        if(itemData.length) {
          (riskSrcContent = riskSrcContent.concat(`<h2>${item.title}:</h2>`)) && 
            (riskSrcContent = riskSrcContent.concat(renderSL(itemData)))
        } else if (stopLists.has(mainKey) && stopLists.get(mainKey).length) {
          (riskSrcContent = riskSrcContent.concat(`<h2>${item.title}:</h2>`)) && 
            (riskSrcContent = riskSrcContent.concat(`<div> Данных по вхождению в стоп-листы не найдено</div>`))
        }
      } else {
        itemData.length && 
          (riskSrcContent = riskSrcContent.concat(`<h2>${item.title}:</h2>`)) && 
            renderArrInfo(itemData)
      }
      return item
    })
    return riskSrcContent = riskSrcContent.concat("</div>")
  }

  const renderFoundersUl = (arrFoundersUl = [], foundersRSContent = "<div class='divider'>") => {
    if(arrFoundersUl.length) {
      foundersRSContent = foundersRSContent.concat('<h2>Результаты проверки ЮЛ:</h2>')
      arrFoundersUl.map(founder => {
        if(companyUlRes.has(founder.key) && founder.key !== mainKey) {
          const founderRiskSrc = companyUlRes.get(founder.key).filter((value, key) => 
            key === "arbiter" ||
            key === "fns" ||
            key === "sanctions" ||
            key === "isponlit_proizvodstva" ||
            key === "spiski" ||
            key === "spark_spiski" ||
            key === "arbiter_other"
          ).toJS()
          foundersRSContent = foundersRSContent.concat(`
            <a name="responseUl-${founder.key}"></a>
            <h2>${founder.shortName} (${founder.inn}):</h2>
          `)
          foundersRSContent = foundersRSContent.concat(`
            ${ companyRiskSource(trasform.riskSource({...founderRiskSrc, stop_list: stopLists.get(founder.key)})) }
          `)
          
        }
        return founder
      })
      return foundersRSContent = foundersRSContent.concat('</div>')
    }
  }

  return `<!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${info}</title>
    <style type="text/css">
      body {
        padding: 1rem 0 1rem 1rem;
      }
      .ul-menu {
        left: 0;
        top: 0;
        width: 100%;
        position: fixed;
        list-style-type: none;
        background-color: #fff;
        padding: 5px;
        box-shadow: 4px 3px 0 #00000017;
        border-radius: 4px;
        display: inline-block;
      }
      .ul-menu label {
        margin-left: 1rem;
      }
      .risks-comment {
        max-width: 600px;
        max-height: 105px;
        overflow-y: auto;
        overflow-x: hidden;
        text-align: left;
        white-space: pre-wrap;
      }
      .risks-descr {
        width: 200px;
        text-align: center;
      }
      .risks-kod {
        text-align: center;
      }
      .risks-caption {
        text-align: left;
        margin: 5px;
      }
      .position-comment {
        max-width: 700px;
        max-height: 105px;
        overflow-y: auto;
        overflow-x: hidden;
        text-align: left;
      }
      nav > ul > li {
        display: inline-block;
        background-color: #fff;
        white-space: nowrap;
      }
      nav > ul > li ul {
        visibility: hidden;
        position: absolute;
        left: 0;
        transition: 0.2s 0.2s;
      }
      nav > ul > li:hover ul {
        visibility: visible;
        transition-delay: 0s;
      }
      nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: #fff;
      }
      nav li {
        margin: 5px;
        position: relative;
        background-color: #fff;
        padding: 0 5px;
      }
      nav li:hover {
        background-color: #e0e0e0;
      }
      nav a {
        display: block;
        text-decoration: none;
      }
      .divider {
        border-bottom: 1px double #8080805e;
        padding-bottom: 1rem;
      }
    </style>
  </head>
  <body>
    <nav>
      <ul class="ul-menu">
        <label>Меню:</label>
        <li><a href="#digets">Выявленные риск факторы</a></li>
        <li><a href="#company-risk-info">Стоп-листы/списки</a></li>
        <li><a href="#headsFl">Связанные лица</a>
          <ul>
            ${renderNavMenu(headsFl)}
            ${renderNavMenuUl(foundersUl)}
          </ul>
        </li>
      </ul>
    </nav>
    <a name="digets"></a>
    <h1>Все найденные риск факторы на ${info}</h1>
    ${ mainDigets && mainDigets.length ?  renderDigets(mainDigets) : "<div> Актуальных риск-факторов не выявлено </div>"}
    <h2>Основная информация по стоп-листам/спискам:</h2>
    <a name="company-risk-info"></a>
    ${ riskSource ?  companyRiskSource(riskSource) : "<div> Данные по стоп-листам/спискам не найдена </div>"}
    <h2>Связанные лица</h2>
    <a name="headsFl"></a>
    <table border="1px" cellpadding="5">
      <caption class="risks-caption"> Физические лица </caption>
      ${ headsFl && headsFl.length ?renderHeadsFl(headsFl) : "<div> Связанных физических лиц не найдено </div>"}
    </table>
    ${renderHeadsFlInfo(headsFl)}
    ${foundersUl ? renderFoundersUl(foundersUl) : ""}
  </body>
  </html>`
}