import { cloneDeep, assign, concat, compact, filter } from 'lodash';
import { createReportFl, createReportUl } from './reports';
import moment from 'moment'
import { fieldsArr, fieldsArrIP } from "./fields"
import store from "../store"

/** Стили для консольных команд */
export const cloCss = { 
  red: "color: white; background-color: red; padding: 0 5px",
  green: "color: white; background-color: green; padding: 0 5px",
  yellow: "color: black; background-color: yellow; padding: 0 5px",
  info: "color: black; background-color: #40a9ff; padding: 0 5px",
}

/** Формирование FormData для запроса */
export const formData = (data, formData) => {
  formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return formData
}

// Валидация инн и огрн
export const validateInn = str => {
  let result = false;
  if (typeof str === 'number') {
    str = str.toString();
  } else if (typeof str !== 'string') {
    str = '';
  }
  let checkDigit = function (str, coefficients) {
    let n = 0;
    for (let i in coefficients) {
      n += coefficients[i] * str[i];
    }
    return parseInt(n % 11 % 10);
  };
  switch (str.length) {
    case 10:
      let n10 = checkDigit(str, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
      if (n10 === parseInt(str[9])) {
        result = true;
      } else result = false
      break;
    case 12:
      let n11 = checkDigit(str, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
      let n12 = checkDigit(str, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
      if ((n11 === parseInt(str[10])) && (n12 === parseInt(str[11]))) {
        result = true;
      } else result = false
      break;
    case 13:
      let n13 = parseInt((parseInt(str.slice(0, -1)) % 11).toString().slice(-1));
      if (n13 === parseInt(str[12])) {
        result = true;
      } else result = false
      break;
    case 15:
      var n15 = parseInt((parseInt(str.slice(0, -1)) % 13).toString().slice(-1));
      if (n15 === parseInt(str[14])) {
        result = true;
      } else result = false
      break;
    default:
      return result
  }
  return result;
}

/** Чистка объекта от пустых значений */
export const compactObj = (obj, clearObj={}) => {
  filter(obj, (value, key) => {if(value && value !== "Не найден") clearObj[key] = value})
  return clearObj
}

/** Преобразование первого символа к верхнему регистру, а все остальные к нижнему */
export const toFirstUpper = str => str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : " "

/* Парсинг ФИО */
export const  parsingFio = fio => {
  const fioArr = fio.split(" ")
  if(fioArr.length > 2) {
    const MiddleName = fioArr.pop()
    const FirstName = fioArr.pop()
    const SurName = String(fioArr)
    return { FirstName, MiddleName, SurName }
  } else {
    const FirstName = fioArr.pop()
    const SurName = String(fioArr)
    const MiddleName = " "
    return { FirstName, MiddleName, SurName }
  }
}

/** Очистка полученных данных по стоп-листам */
export const clearStopLists = (lists, alone) => {
  if(JSON.stringify(lists) === "[]") return []
  else if (alone) {
    lists.rows = lists.rows.map(factorObj => {
      const newFactorObj = {}
      for (const key in factorObj) {
        if (
          factorObj.hasOwnProperty(key) && 
          factorObj[key] !== "-" && 
          factorObj[key] !== "" && 
          factorObj[key] !== null && 
          factorObj[key] !== "!^!  \r" &&
          factorObj[key] !== "NULL") {
          newFactorObj[key] = factorObj[key];
        }
      }
      return newFactorObj
    })
    return lists
  } else {
    return lists.map(base => {
      base.rows = base.rows.map(factorObj => {
        const newFactorObj = {}
        for (const key in factorObj) {
          if (
            factorObj.hasOwnProperty(key) && 
            factorObj[key] !== "-" && 
            factorObj[key] !== "" && 
            factorObj[key] !== null && 
            factorObj[key] !== "!^!  \r" &&
            factorObj[key] !== "NULL") {
            newFactorObj[key] = factorObj[key];
          }
        }
        return newFactorObj
      })
      return base
    })
  }
}

/** Обновленный функционал очистки */
export const clearStopListsArr = (lists, alone) => {
  if(JSON.stringify(lists) === "[]") return []
  else if (alone) {
    lists.rows = lists.rows.map(factorObj => {
      const newFactorObj = {}
      for (const key in factorObj) {
        if (
          factorObj.hasOwnProperty(key) && 
          factorObj[key] !== "-" && 
          factorObj[key] !== "" && 
          factorObj[key] !== null && 
          factorObj[key] !== "!^!  \r" &&
          factorObj[key] !== "NULL") {
          newFactorObj[key] = factorObj[key];
        }
      }
      return newFactorObj
    })
    return lists
  } else {
    const stopLists = []
    lists.map(res => {
      if(!res) return res
      else if(res.Response.length) {
        return res.Response.map(base => {
          if(!base) return base
          const {rows, ...baseInfo} = base
          base.rows = base.rows.map(factorObj => {
            const newFactorObj = {}
            for (const key in factorObj) {
              if (
                factorObj.hasOwnProperty(key) && 
                factorObj[key] !== "-" && 
                factorObj[key] !== "" && 
                factorObj[key] !== null && 
                factorObj[key] !== "!^!  \r" &&
                factorObj[key] !== "NULL") {
                newFactorObj[key] = factorObj[key];
              }
            }
            return newFactorObj
          })
          return stopLists.push({...baseInfo, rows: base.rows})
        })
      }
      else return res
    })
    return stopLists
  }
}

/** Очистка полученных данных по стоп-листам */
export const clearRiskFactors = (factors =[], digets) => {
  if(JSON.stringify(factors) === "[]") return []
  else if (digets) return factors.filter(item =>  moment(item.data_dobavleniya_zapisi).format("L") === moment(Date.now()).format("L") ).map(factorObj => {
    const newFactorObj = {}
    for (const key in factorObj) {
      if (
        factorObj.hasOwnProperty(key) && 
        factorObj[key] !== "-" && 
        factorObj[key] !== "" && 
        factorObj[key] !== null && 
        factorObj[key] !== "!^!  \r" && 
        factorObj[key] !== " "
      ) {
        newFactorObj[key] = factorObj[key];
        newFactorObj["key"] = factorObj["key"] ? factorObj["key"] : uuid();
        newFactorObj.time = `${factorObj.data_dobavleniya_zapisi} ${factorObj.vremya_dobavleniya_zapisi}`;
      }
    }
    return newFactorObj
  })
  else return factors.map(factorObj => {
    const newFactorObj = {}
    for (const key in factorObj) {
      if (
        factorObj.hasOwnProperty(key) && 
        factorObj[key] !== "-" && 
        factorObj[key] !== "" && 
        factorObj[key] !== null && 
        factorObj[key] !== "!^!  \r" && 
        factorObj[key] !== " "
      ) {
        newFactorObj[key] = factorObj[key];
        newFactorObj["key"] = factorObj["key"] ? factorObj["key"] : uuid();
        newFactorObj.time = `${factorObj.data_dobavleniya_zapisi} ${factorObj.vremya_dobavleniya_zapisi}`;
      }
    }
    return newFactorObj
  })
}

/* Парсинг Паспорта */
export const parsingPassport = passport => {
  if(!passport) return { Seria: "", Number: "" }
  const passArr = passport.split(" ")
  const Number = passArr.pop()
  const Seria = passArr.pop()
  return { Seria, Number }
}

/* Парсинг адреса */
export const parsingAddress = address => {
  let p = address.split(' ');
  let RegionExp = ''; // Регион
  let CityExp = ''; // Нас. пункт
  let StreetExp = ''; // Улица
  let HouseExp = ''; // Номер дома
  let BuildExp = ''; // Корп
  let BuildingExp = ''; // Стр
  let FlatExp = ''; // Квар
  let i = p.length - 1;
  if (parseInt(p[i - 3])) {
    FlatExp = p.pop();
    BuildingExp = p.pop();
    BuildExp = p.pop();
    HouseExp = p.pop();
  } else if (parseInt(p[i - 2])) {
    FlatExp = p.pop();
    BuildExp = p.pop();
    HouseExp = p.pop();
  } else if (parseInt(p[i - 1])) {
    FlatExp = p.pop();
    HouseExp = p.pop();
  } else {
    HouseExp = p.pop();
  }
  StreetExp = p.pop();
  if (p.length) CityExp = p.pop();
  if (p.length) RegionExp = region.filter(item => item.title.toUpperCase().indexOf(p[0].toUpperCase()) !== -1)[0]
  if(!RegionExp) RegionExp = {value: "", title: ""}

  return {
    CityExp, // Нас. пункт
    StreetExp, // Улица
    HouseExp, // Номер дома
    BuildExp, // Корп
    BuildingExp, // Стр
    FlatExp, // Квар
    RegionExp: RegionExp.value, // Регион
    RegionExpText: RegionExp.title// Регион
  }
}

/** Преобразование сумм (формат по 3) */
// eslint-disable-next-line
export const sumTrans = str => String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + '\u200A')

/** Форматирование данных арбитража */
export const updateArbiter = (str = "") => {
  if(!str) return "0 руб. (0)"
  const newStr = str.match(/(\d{0,}).(\d{0,})( руб. )\((\d{0,}.\d{0,})\)/)
  if(newStr[1] === "" && newStr[2] === "") return `0 руб. (${sumTrans(newStr[4])})`
  return `${sumTrans(newStr[1])}.${newStr[2]}${newStr[3]}(${sumTrans(newStr[4])})`
}

/** Загрузка полученного отчета в формате html */
export const dowloadHtmlFile = (content, contentType = 'application/octet-stream', filename) => {
  filename = `${content.info} - ${getDownloadTime(Date.now())}.html`
  var a = document.createElement('a');
  var blob = new Blob([content.isFl ? createReportFl(content) : createReportUl(content)], {'type': contentType});
  a.href = window.URL.createObjectURL(blob);
  // eslint-disable-next-line
  a.download = filename.replace(/\"/gi, "");
  if(a.hasOwnProperty("click")) {
    a.click();
  } else {
    // Создание синтетического события для браузеров их не поддерживающих
    const eventClick = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'canceble': true
    })
    a.dispatchEvent(eventClick)
  }
}

/** Валидация номера дома - получение только числового значения */
export const houseNum = (str = "") =>  str.match(/\d*/)[0]

/** Генерация Id ключей */
// eslint-disable-next-line
export const uuid = () =>  ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16))

/** Преобразование даты к формату DD.MM.YYYY */
export const getDate = data =>  moment(data).format('DD.MM.YYYY')

/** Поличение текущей даты в формате DD.MM.YYYY */
export const getNowDate = () =>  new Date(Date.now()).toLocaleString().split(", ")[0]

/** Преобразование даты к формату DD.MM.YYYY h:mm:ss */
export const getTimeAndDate = data =>  moment(data).format('DD.MM.YYYY HH:mm:ss')

/** Преобразование даты к формату DD.MM.YYYY h:mm:ss */
export const getDownloadTime = data =>  moment(data).format('DD.MM.YYYY - HH.mm.ss')

/** Преобразование даты к формату mm:ss */
export const getTime = data =>  moment(+data).format('mm:ss')

/** Преобразование даты к формату mm:ss */
export const getTimeDev = (recTime, dateNow) =>  {
  const timeRec = moment(+recTime).add(20, 'm')
  const timeNow = moment(dateNow)
  const timePercent = (moment(+recTime).add(20, 'm').valueOf() - moment(dateNow).valueOf()) * 100 / ((20*60000))
  const timeObj = {
    timeRec: moment(+recTime).add(20, 'm'),
    timeNow: moment(dateNow),
    timePercent: moment(dateNow) * 100 / moment(+recTime).add(20, 'm'),
    hours: timeRec.diff(timeNow, 'h'),
    minutes: timeRec.diff(timeNow, 'm') % 60,
    seconds:  timeRec.diff(timeNow, 's') % 60
  }
  if(timeRec.diff(timeNow, 's') <= 0) return {status: false}
  return {
    status: true,
    text: `${ 
      timeObj.minutes >= 10 ? timeObj.minutes : "0" + timeObj.minutes }:${ 
      timeObj.seconds >= 10 ? timeObj.seconds : "0" + timeObj.seconds }`,
    diff: timeRec.diff(timeNow),
    percent: timePercent
  }
}

/** Проверка на четность текущего поличества секунд */
export const getSeconds = dateNow => moment(dateNow).seconds() % 2 === 0

/** Преобразование даты к формату YYYY-MM-DD */
export const getUSDate = arr => {
  const dateArrUs = arr.map(item => {
    const dateArr = item.split(".")
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
  })
  return dateArrUs
}

/** Получение объекта даты из строкового значения */
export const getDatePickerValue = date => {
  const dateArr = date.split(".")
    return moment(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`)
}

/** Получение объекта даты из строкового значения */
export const getDPValue = date => {
  const dateArr = date.split(".")
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
}

/** Преобразование имени кампании к укороченной версии */
export const getShortCompName = name => {
  return name
    .replace(/^Общество с ограниченной ответственностью/gi, 'ООО')
    .replace(/^Общество Сограниченной ответственностью/gi, 'ООО')
    .replace(/^Публичное акционерное общество/gi, 'ПАО')
    .replace(/^Закрытое акционерное общество/gi, 'ПАО')
    .replace(/^Открытое акционерное общество/gi, 'ОАО')
    .replace(/^Акционерное общество/gi, 'АО')
    .replace(/^МЕСТНАЯ РЕЛИГИОЗНАЯ ОРГАНИЗАЦИЯ/gi, 'МРО')
    .replace(/^Администрация/gi, 'Адм-ция')
    .replace(/ОРТОДОКСАЛЬНОГО ИУДАИЗМА/gi, 'ОИ')
    .replace(/ОДИНЦОВСКОГО РАЙОНА/gi, 'ОР')
    .replace(/КОММЕРЧЕСКАЯ НЕДВИЖИМОСТЬ/gi, 'КН')
    .replace(/МОСКОВСКОЙ ОБЛАСТИ/gi, 'МО')
    .replace(/Финансово-Промышленная корпорация/gi, 'ФПК')
    .replace(/Финансово-промышленной корпорации/gi, 'ФПК')
    .replace(/Управляющая компания/gi, 'УК')
    .replace(/Муниципального Района/gi, 'МР')
}

/** Форматирование приходящего региона */
export const getRegionTitle = name => {
  return name && name
    .replace(/^г. /gi, '')
    .replace(/^ГОРОД /gi, '')
}

export const htmlTransform = str => {
  return str
    .replace(/id="header"/g, 'id="header" style="display:none"')
    .replace(/id="paper"/g, 'id="paper" style="padding-top:0; border: 0; margin-left: 0; margin-right: 0; box-shadow: none; width: 100% !important; max-width: none;"')
    .replace(/id="requestInfo"/g, 'id="requestInfo" style="top:2rem"')
    .replace(/id="content"/g, 'id="content" style="padding-top: 0;"')
    .replace(/class="mid"/g, 'class="mid" style="font-size: 1rem;"')
    .replace(/<table/g, '<table style="width: 100%; font-size: 1rem;"')
    .replace(/\/\* Основные стили \*\//g, '/* Основные стили */ u{background-color: yellow;}')
    .replace(/<i/g, '<i style="font-size: 1rem;"')
    .replace(/<h2/g, '<h2 style="font-size: 1.5rem; font-weight: 500;"')
    .replace(/<h3/g, '<h3 style="font-size: 1.2rem; font-weight: 500;"')
    .replace(/<h5/g, '<h5 style="font-size: 1.5rem; font-weight: 500;"')
    .replace(/<th/g, '<th style="font-weight: 500;"')
    .replace(/windows-1251/g, 'utf-8')
}

export const htmlTransformFssp = str => {
  return str
    .replace(/<span>Распечатать<\/span>/g, '')
    // eslint-disable-next-line
    .replace(/  ,  ,  ,  , /g, '')
    // eslint-disable-next-line
    .replace(/,  ,/g, '')
    .replace(/<tr class=" "/g, '<tr style="text-align: center;"')
    .replace(/<td class="first"/g, '<td style="text-align: center;padding-bottom: 5px;"')
    .replace(/<table/g, '<table style="font-size: 9pt;"')
    .replace(/<td class=""/g, '<td style="text-align: center;padding-bottom: 5px;"')
}

class TransformData {
  companySource = inputData => {
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const orgInfo = cloneFieldsArr.map( item => {
      for (const key in inputData) {
        if(item.id === key ) {
          return {
            id: key,
            title: item.title,
            data : inputData[key]
          }
        }
      }
      return null
    })
    return compact(orgInfo)
  }

  /** Иммутабельное обновление основных данных об искомой кампании ЮЛ */
  updateComSrc = (prevStore, serverData, reqnum) => {
    try {
      fieldsArr.map( fieldItem => {
        for (const key in serverData) {
          if( fieldItem.search === "Predecessor" && fieldItem.func ) {
            return prevStore = prevStore.set(fieldItem.id, serverData.ps.Data ? fieldItem.func(serverData.ps.Data.Report.Reorganizations[fieldItem.search]) : "")
          } else if( fieldItem.search === "Successor" && fieldItem.func ) {
            return prevStore = prevStore.set(fieldItem.id, serverData.ps.Data ? fieldItem.func(serverData.ps.Data.Report.Reorganizations[fieldItem.search]) : "")
          } else if(fieldItem.search === key && !fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, serverData[fieldItem.search])
          } else if(fieldItem.search === key && fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, fieldItem.func(serverData[fieldItem.search]))
          }
        }
        return fieldItem
      })

      const updateHeads = prevStore.get("heads").map(item => ({
        ...item,
        fio: (`${item.last_name} ${item.first_name} ${item.middle_name}`).trim(),
        id: uuid(),
        timeRequest: Date.now(),
        organisation: {
          name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
          inn: prevStore.get("inn") ? prevStore.get("inn") : "",
          ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
        },
        position: [{
          tagName : item.position,
          organisation: {
            name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
            inn:prevStore.get("inn") ? prevStore.get("inn") : "",
            ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
          }
        }],
      }))

      prevStore = prevStore.set("heads", updateHeads)
      prevStore = prevStore.set("name", prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "")
      if(prevStore.get("arbiter").other.length) prevStore = prevStore.set("arbiter_other", prevStore.get("arbiter").other)

      if(prevStore.get("leaders_list").length) {
        const historyFl = prevStore.get("leaders_list").map(fl => ({
          id: uuid(),
          ActualDate: fl.ActualDate ? fl.ActualDate : getDate(Date.now()),
          fio: `${fl.last_name} ${fl.first_name} ${fl.middle_name}`,
          first_name: fl.first_name,
          inn: fl.inn ? fl.inn : "Не найден",
          last_name: fl.last_name,
          middle_name: fl.middle_name,
          organisation: {
            name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
            inn:prevStore.get("inn") ? prevStore.get("inn") : "",
            ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
          },
          position: [{
            tagName: fl.position,
            organisation: {
              name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
              inn:prevStore.get("inn") ? prevStore.get("inn") : "",
              ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
            }
          }],
        }))
        prevStore = prevStore.set("management_history", historyFl)
      }
      prevStore = prevStore.set('reqnum', reqnum)
      prevStore = prevStore.set('historyIdentify', serverData.history_identify)
      return prevStore
    } catch (error) {
      console.log('%cОшибка в преобразовании updateComSrc', cloCss.red, error)
    }
  }

  /** Иммутабельное обновление основыных данных об искомой кампании ИП */
  updateIPComSrc = (prevStore, serverData, reqnum) => {
    try {
      fieldsArrIP.map(fieldItem => {
        for (const key in serverData) {
          if(fieldItem.search === key && !fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, serverData[fieldItem.search])
          } else if(fieldItem.search === key && fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, fieldItem.func(serverData[fieldItem.search]))
          }
        }
        return fieldItem
      })

      prevStore = prevStore.set("name", prevStore.get("full_name"))

      const addHeds = (fio, inn, date) => {
          const fioArr = fio.split(" ")
          const middle_name = fioArr.pop()
          const first_name = fioArr.pop()
          const last_name = String(fioArr)
          return {
            fio,
            id: uuid(),
            middle_name,
            last_name, 
            first_name,
            position: [{
              tagName : "Собственник",
              organisation: {
                name: prevStore.get("name") ? getShortCompName(prevStore.get("full_name")) : "",
                inn: prevStore.get("inn") ? prevStore.get("inn") : "",
                ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
              }
            }], 
            inn, 
            ActualDate: date,
            timeRequest: Date.now(),
            organisation: {
              name: "Индивидуальный предприниматель",
              inn: prevStore.get("inn") ? prevStore.get("inn") : "",
              ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
            }
          }
        }
      prevStore = prevStore.set("heads", [addHeds(prevStore.get("full_name"), prevStore.get("inn"), prevStore.get("registration_date"))])
      if(prevStore.get("arbiter").other.length) prevStore = prevStore.set("arbiter_other", prevStore.get("arbiter").other)
      prevStore = prevStore.set('reqnum', reqnum)
      prevStore = prevStore.set('historyIdentify', serverData.history_identify)
      return prevStore
    } catch (error) {
      console.log('%cОшибка в преобразовании updateIPComSrc', cloCss.red, error)
    }
  }
  
  /** Иммутабельное сохранение данных по стоп-листам */
  stop_lists = (prevHeads, lists = [], id) => {
    return prevHeads = prevHeads.map(head => {
      if(head.id === id) {
        head.timeRequest = Date.now()
        const arr = lists.map(list => {
          if(head.stop_lists && head.stop_lists.filter(item => item.ID_columns === list.ID_columns).length) {
            return null
          } else {
            return clearStopLists(list, true)
          }
        })
        head.stop_lists = head.stop_lists ? concat(head.stop_lists, compact(arr)) : concat([], clearStopLists(lists))
      }
      return head
    })
  }

  getMainDigest = (arr, newArr = {digets: [], history: []}) => {
    arr.map(item => {
      newArr.digets = concat(newArr.digets, compact(item.digets))
      newArr.history = concat(newArr.history, compact(item.history))
      return item
    })
    return newArr
  }

  /** Иммутабельное сохранение данных по стоп-листам */
  stopListsArr = (prevHeads, lists = [], id) => {
    return prevHeads = prevHeads.map(head => {
      if(head.id === id) {
        head.timeRequest = Date.now()
        const stopLists = [] 
        lists.map(res => {
          if(!res) return res
          else if(res.Response.length) {
            return res.Response.map(base => {
              if(!base) return base
              if(head.stop_lists && head.stop_lists.filter(item => item.ID_columns === base.ID_columns).length) return null
              else return stopLists.push(clearStopListsArr(base, true))
            })
          } else return res
        })
        head.stop_lists = clearStopListsArr(lists)
      }
      return head
    })
  }

  /** Иммутабельное сохранение стоп-листов по id */
  updateStopListArr = (lists = []) =>  clearStopListsArr(lists)

  /** Иммутабельное обновление выбранных данных пользователя */
  identifyUserInfo = (prevHeads, serverData, user, id) => {
    return prevHeads = prevHeads.map( head =>  {
      if(head.id === id) {
        head.timeRequest = Date.now()
        head.identifyInfo = {
          ...serverData,
          html: serverData.html ? htmlTransform(serverData.html) : ""
        }
        head.selectedInfo = user
      }
      return head
    })
  }

  updateIdentifyInfo = serverData =>  ({
    ...serverData,
    html: serverData.html ? htmlTransform(serverData.html) : "" 
  })

  /** Иммутабельное обновление выбранных данных пользователя */
  updateSelectedInfo = (prevHeads, user, id) => {
    return prevHeads = prevHeads.map( head =>  {
      if(head.id === id) {
        // head.timeRequest = Date.now()
        head.selectedInfo = user
      }
      return head
    })
  }

  historySelectedInfo = ({prevHeads, historyIdentify, storeSelInfoFl}) => {
    if(historyIdentify && historyIdentify.length) {
        historyIdentify.map(item => {
          if(item.type === "Request") {
            prevHeads.map(head => {
              if(
                (
                  (head.inn === item.request.INNExp) &&
                  (head.fio.toLowerCase() === (`${item.request.SurName} ${item.request.FirstName} ${item.request.MiddleName}`).toLowerCase())
                )
                && !storeSelInfoFl.has(head.id)
              ) {
                storeSelInfoFl = storeSelInfoFl.set(head.id, {
                  INN: head.inn,
                  FirstName: head.first_name, 
                  FirstNameArch: head.first_name,
                  MiddleName: head.middle_name,
                  SurName: head.last_name,
                  DateOfBirth: item.request.DateOfBirth,
                  Seria: item.request.Seria,
                  Number: item.request.Number,
                  RegionExp: item.request.RegionExp,
                  CityExp: item.request.CityExp,
                  StreetExp: item.request.StreetExp,
                  HouseExp: item.request.HouseExp,
                  BuildExp: "",
                  BuildingExp: "",
                  FlatExp: "",
                  INNArr: [head.inn],
                  DateOfBirthArr: [item.request.DateOfBirth],
                  ogrn: head.organisation.ogrn
                })
              }
              return head
            })
          }
          return item
        })
        return storeSelInfoFl
    } else {
      return storeSelInfoFl
    }
  }

  /** Иммутабельное сохранения запрашиваемого документа */
  updateDocuments = (prevDocs, serverBlob, xhdoc) => {
    return prevDocs = prevDocs.map( doc =>  {
      if(doc.xhdoc === xhdoc) {
        doc.blob = serverBlob
      }
      return doc
    })
  }

  /** Иммутабельное обновление выбранных данных пользователя */
  updateSelectedUserInfo = (prevHeads, user, id, serverData ) => {
    console.log('serverData', serverData)
    const {html = "", lists = [], vector = []} = serverData
    return prevHeads = prevHeads.map( head =>  {
      if(head.id === id) {
        head.timeRequest = Date.now()
        head.selectedInfo = user
        head.croinform = { 
          html : html ? htmlTransform(html) : "", 
          lists, 
          vector 
        }
      }
      return head
    })
  }

  croinformInfoResponse = serverData => ({
    html: serverData.html ? htmlTransform(serverData.html) : "", 
    lists: serverData.lists, 
    vector: serverData.vector
  })

  /** Иммутабельное обновление данных по ФССП */
  updatedFsspInfo = (prevHeads, fssp, id ) => {
    return prevHeads = prevHeads.map( head =>  {
      if(head.id === id) {
        head.timeRequest = Date.now()
        head.fsspInfo = fssp ? htmlTransformFssp(fssp) : ""
      }
      return head
    })
  }

  /** Иммутабельное сохранение данных ФССП по id */
  clearedFsspInfo = fssp =>  fssp ? htmlTransformFssp(fssp) : ""

  managementSource = inputData => {
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el )  return assign(item, { "data" : inputData[el]})
      }
      return item
    })
    // console.table(clgData)
    const filteredManagementInfo = fullOrganistionInfo.filter(item => (
      item.id === "befenicials" || 
      item.id === "founders_fl" || 
      item.id === "founders_ul" || 
      item.id === "heads"  || 
      item.id === "leaders_list"  || 
      item.id === "management_companies"))
    return filteredManagementInfo
  }
  /** Преобразование данных о руководителях и связанных лицах */
  getHeadsSrc = inputData => {
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el )  return assign(item, { "data" : inputData[el]})
      }
      return item
    })
    return fullOrganistionInfo.filter(item => ( item.id === "heads" ))
  }

  updateManagmentSrc = (prevStore, serverData) => {
    try {
      if(serverData === false) return prevStore
      fieldsArr.map( fieldItem => {
        for (const el in serverData) {
          if( fieldItem.search === el && 
            ( 
              fieldItem.search === "founders_fl" || 
              fieldItem.search === "founders_ul" || 
              fieldItem.search === "ul" || 
              fieldItem.search === "fl" ||
              fieldItem.search === "heads_ul" ||
              fieldItem.search === "heads_fl" ||
              fieldItem.search === "share_holders_fl" ||
              fieldItem.search === "share_holders_ul"
            ) 
              && el.func) {
            return prevStore = prevStore.set(fieldItem.id, fieldItem.func(serverData[fieldItem.search]))
          } else if( fieldItem.search === el && 
            ( 
              fieldItem.search === "founders_fl" ||
              fieldItem.search === "founders_ul" ||
              fieldItem.search === "ul" ||
              fieldItem.search === "fl" ||
              fieldItem.search === "heads_ul" ||
              fieldItem.search === "heads_fl" ||
              fieldItem.search === "share_holders_fl" ||
              fieldItem.search === "share_holders_ul"
            ) 
              && !el.func) {
            return prevStore = prevStore.set(fieldItem.id, serverData[fieldItem.search])
          }
        }
        return fieldItem
      })

      // Учредители
      if( serverData.founders_fl.length ) {
        let notFoundsHeadsFl = []
        const updatedHeads = prevStore.get("heads").map( heads => {
          if( serverData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio).length) {
            const founders_fl = serverData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio)[0]
            return {
              ...heads,
              position: concat(
                heads.position,
                {
                  tagName: `Учредитель`,
                  organisation: {
                    name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                    inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                    ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
                  },
                  share: founders_fl.share
                }
              )
            }
          }
          return heads
        })
        serverData.founders_fl.map(founders_fl => {
          if(!prevStore.get("heads").filter(head => head.fio === founders_fl.fio).length) {
            return notFoundsHeadsFl.push({
              id: uuid(),
              ActualDate: founders_fl.date ? founders_fl.date : getDate(Date.now()),
              fio: founders_fl.fio,
              first_name: parsingFio(founders_fl.fio).FirstName,
              inn: founders_fl.innfl ? founders_fl.innfl : "Не найден",
              last_name: parsingFio(founders_fl.fio).SurName,
              middle_name: parsingFio(founders_fl.fio).MiddleName,
              organisation: {
                name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
              },
              position: [{
                tagName: `Учредитель`,
                organisation: {
                  name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                  inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                  ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
                },
                share: founders_fl.share
              }],
            })
          }
          return null
        })
        prevStore = prevStore.set("heads", concat(updatedHeads, notFoundsHeadsFl))
        console.log(`%c1 lvl FOULDERS_FL | ${prevStore.get("name") ? getShortCompName(prevStore.get("name")) : ""}`, cloCss.yellow, prevStore.get("heads"))
      }

      // Акционеры
      if(serverData.share_holders_fl.length) {
        let notFoundsShareHoldersFl = []
        const headPerson = prevStore.get("heads").map( heads => {
          if(serverData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio).length) {
            const newInfo = serverData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio)[0]
            return {
              ...heads,
              position: concat(
                heads.position,
                {
                  tagName: `Акционер`,
                  organisation: {
                    name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                    inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                    ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
                    address: newInfo.address ? newInfo.address : ""
                  },
                  share: {
                    capitalSharesPercent: newInfo.capitalSharesPercent,
                    votingSharesPercent: newInfo.votingSharesPercent,
                  }
                }
              )
            }
          }
          return heads
        })
        serverData.share_holders_fl.map(share_holders_fl => {
          if(!prevStore.get("heads").filter(head => head.fio === share_holders_fl.fio).length) {
            return notFoundsShareHoldersFl.push({
              id: uuid(),
              ActualDate: share_holders_fl.date ? share_holders_fl.date : getDate(Date.now()),
              fio: share_holders_fl.fio,
              first_name: parsingFio(share_holders_fl.fio).FirstName,
              inn: share_holders_fl.innfl ? share_holders_fl.innfl : "Не найден",
              last_name: parsingFio(share_holders_fl.fio).SurName,
              middle_name: parsingFio(share_holders_fl.fio).MiddleName,
              organisation: {
                name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
              },
              position: [{
                tagName: `Акционер`,
                organisation: {
                  name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
                  inn:prevStore.get("inn") ? prevStore.get("inn") : "",
                  ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
                },
                share: {
                  capitalSharesPercent: share_holders_fl.capitalSharesPercent,
                  votingSharesPercent: share_holders_fl.votingSharesPercent,
                }
              }],
            })
          }
          return null
        })
        prevStore = prevStore.set("heads", concat(headPerson, notFoundsShareHoldersFl))
        console.log(`%c1 lvl SHARE_HOLDERS_FL | ${prevStore.get("name") ? getShortCompName(prevStore.get("name")) : ""}`, cloCss.yellow, prevStore.get("heads"))
      }
      return prevStore
    } catch (error) {
      console.log('%cОшибка в преобразовании updateManagmentSrc', cloCss.red, error)
    }
  }

  /** Обновление информации по Связанным лицам, если это ЮЛ */
  updateManagmentULSrc = (prevHeads, serverData, user) => {
    console.log(`${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, user)
    if(!serverData) return prevHeads
    // Руководство
    if(serverData.heads_fl.length) {
      let notFoundsHeadsFl = []
      const headPerson = prevHeads.map( (heads, i) => {
        if( serverData.heads_fl.filter(heads_fl => heads.fio === heads_fl.fio).length) {
          const updatedHead = serverData.heads_fl.find(heads_fl => heads.fio === heads_fl.fio)
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: updatedHead.position,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                  ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                  address: user.address ? user.address : "",
                  share: {
                    sum: user.founder ? user.share.sum : "",
                    capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                    votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                  }
                }
              }
            )
          }
        }
        return heads
      })
      serverData.heads_fl.map(heads_fl => {
        if(!prevHeads.filter( heads => heads.fio === heads_fl.fio).length) {
          return notFoundsHeadsFl.push({
            id: uuid(),
            ActualDate: heads_fl.date ? heads_fl.date : getDate(Date.now()),
            fio: heads_fl.fio,
            first_name: parsingFio(heads_fl.fio).FirstName,
            inn: heads_fl.innfl ? heads_fl.innfl : "Не найден",
            last_name: parsingFio(heads_fl.fio).SurName,
            middle_name: parsingFio(heads_fl.fio).MiddleName,
            organisation: {
              name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
              inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
              ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден"
            },
            position: [{
              tagName: heads_fl.position,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                address: user.address ? user.address : "",
                share: {
                  sum: user.founder ? user.share.sum : "",
                  capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                  votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                }
              }
            }],
          })
        }
        return null
      })
      prevHeads = concat(headPerson, notFoundsHeadsFl)
      console.log(`%c2 lvl HEADS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, prevHeads)
    }

    // Учредители
    if(serverData.founders_fl.length) {
      let notFoundsFoundersFl = []
      const updatedHeads = prevHeads.map( heads => {
        if( serverData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio).length) {
          const founders_fl = serverData.founders_fl.find(founders_fl => heads.fio === founders_fl.fio)
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Учредитель`,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                  ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                  share: {
                    sum: user.founder ? user.share.sum : "",
                    capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                    votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                  }
                },
                share: founders_fl.share
              }
            )
          }
        }
        return heads
      })
      serverData.founders_fl.map(founders_fl => {
        if(!prevHeads.filter( heads => founders_fl.fio === heads.fio).length) {
          return notFoundsFoundersFl.push({
            id: uuid(),
            ActualDate: founders_fl.date ? founders_fl.date : getDate(Date.now()),
            fio: founders_fl.fio,
            first_name: parsingFio(founders_fl.fio).FirstName,
            inn: founders_fl.innfl ? founders_fl.innfl : "Не найден",
            last_name: parsingFio(founders_fl.fio).SurName,
            middle_name: parsingFio(founders_fl.fio).MiddleName,
            organisation: {
              name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
              inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
              ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден"
            },
            position: [{
              tagName: `Учредитель`,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                share: {
                  sum: user.founder ? user.share.sum : "",
                  capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                  votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                }
              },
              share: founders_fl.share
            }],
          })
        }
        return null
      })
      prevHeads = concat(updatedHeads, notFoundsFoundersFl)
      console.log(`%c2 lvl FOULDERS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, prevHeads)
    }

    // Акционеры
    if(serverData.share_holders_fl.length) {
      let notFoundsShareHoldersFl = []
      const headPerson = prevHeads.map( heads => {
        if(serverData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio).length) {
          const share_holders_fl = serverData.share_holders_fl.find(share_holders_fl => heads.fio === share_holders_fl.fio)
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Акционер`,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                  ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                  address: user.address ? user.address : "",
                  share: {
                    sum: user.founder ? user.share.sum : "",
                    capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                    votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                  }
                },
                share: {
                  capitalSharesPercent: share_holders_fl.capitalSharesPercent,
                  votingSharesPercent: share_holders_fl.votingSharesPercent,
                }
              }
            )
          }
        }
        return heads
      })
      serverData.share_holders_fl.map(share_holders_fl => {
        if(!prevHeads.filter(head => head.fio === share_holders_fl.fio).length) {
          return notFoundsShareHoldersFl.push({
            id: uuid(),
            ActualDate: share_holders_fl.date ? share_holders_fl.date : getDate(Date.now()),
            fio: share_holders_fl.fio,
            first_name: parsingFio(share_holders_fl.fio).FirstName,
            inn: share_holders_fl.innfl ? share_holders_fl.innfl : "Не найден",
            last_name: parsingFio(share_holders_fl.fio).SurName,
            middle_name: parsingFio(share_holders_fl.fio).MiddleName,
            organisation: {
              name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
              inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
              ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
              address: user.address ? user.address : "",
            },
            position: [{
              tagName: `Акционер`,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : serverData.egr.length ? serverData.egr[0].inn : "Не найден",
                ogrn: user.ogrn ? user.ogrn : serverData.egr.length ? serverData.egr[0].ogrn : "Не найден",
                address: user.address ? user.address : "",
                share: {
                  sum: user.founder ? user.share.sum : "",
                  capitalSharesPercent: user.shareholder ? user.capitalSharesPercent : "",
                  votingSharesPercent: user.shareholder ? user.votingSharesPercent : "",
                }
              },
              share: {
                capitalSharesPercent: share_holders_fl.capitalSharesPercent,
                votingSharesPercent: share_holders_fl.votingSharesPercent,
              }
            }],
          })
        }
        return null
      })
      prevHeads = concat(headPerson, notFoundsShareHoldersFl)
      console.log(`%c2lvl SHARE_HOLDERS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, prevHeads)
    }

    return prevHeads
  }

  riskSource = inputData => {
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const riskOrgInfo = cloneFieldsArr.map( item => {
      for (const key in inputData) {
        if(item.id === key ) {
          return {
            id: key,
            title: item.title,
            data : inputData[key]
          }
        }
      }
      return null
    })
    return compact(riskOrgInfo)
  }

  /** Иммутабельное сохранение данных по риск-факторам */
  updateRiskFactors = (props) => {
    let { prevHeads, factors, id, digest, info } = props
    if(JSON.stringify(factors.history) === []) return prevHeads
    const newHeads = prevHeads.map(head => {
      if(head.id === id) {
        if(!head.risk_factors) head.risk_factors = { history: [], digets: [] }
        head.timeRequest = Date.now()
        head.risk_factors.digets = clearRiskFactors(factors.digest, true)
        head.risk_factors.history = clearRiskFactors(factors.digest)
      }
      return head
    })
    if(digest) {
      const updatedDigets = this.updateDigets(digest, {name: info.name, inn: info.inn}, newHeads)
      return {
        digest: newHeads,
        mainDigets: updatedDigets,

      }
    }
    return {
      digest: newHeads
    }
  }

  saveRiskFaktorsFl = props => {
    let { factors, id, heads } = props
    const headInfo = heads.find(item => item.id === id)

    const digets = clearRiskFactors(factors.digest, true).map(item => {
      item.object = `${headInfo.fio} (${headInfo.inn})`
      item.objectKey = id
      item.name = headInfo.fio
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      item.sortedTime = item.familia ? 
        moment(item.time).valueOf() : moment(item.vremya_akceptovaniya_zapisi).valueOf()
      return compactObj(item)
    })
    const history = clearRiskFactors(factors.digest).map(item => {
      item.object = `${headInfo.fio} (${headInfo.inn})`
      item.objectKey = id
      item.name = headInfo.fio
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      item.sortedTime = item.familia ? 
        moment(item.time).valueOf() : moment(item.vremya_akceptovaniya_zapisi).valueOf()
      return compactObj(item)
    })
    return {digets, history}
  }

  saveRiskFaktorsUl = props => {
    let { factors, info } = props
    const digets = clearRiskFactors(factors.digest, true).map(item => {
      item.object = `${info.name} (${info.inn})`
      item.name = info.name
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      item.sortedTime = item.familia ? 
        moment(item.time).valueOf() : moment(item.vremya_akceptovaniya_zapisi).valueOf()
      return compactObj(item)
    })
    const history = clearRiskFactors(factors.history).map(item => {
      item.object = `${info.name} (${info.inn})`
      item.name = info.name
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      item.sortedTime = item.familia ? 
        moment(item.time).valueOf() : moment(item.vremya_akceptovaniya_zapisi).valueOf()
      return compactObj(item)
    })
    return {digets, history}
  }

  /** Обновление данных дайджеста с риск-факторами по кампании */
  updateDigets = (inputData, info, heads) => {
    const newDigets = inputData.digest.map(item => {
      item.object = `${info.name} (${info.inn})`
      item.name = info.name
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      return compactObj(item)
    })
    const newHistory = inputData.history.map(item => {
      item.object = `${info.name} (${info.inn})`
      item.name = info.name
      item.key = item.hasOwnProperty("key") ? item.key : uuid()
      return compactObj(item)
    })
    if(heads.length) {
      const updatedDigetsList = this.getHeadsRiskFactors(heads, {
        digets: newDigets,
        history: newHistory,
        risks: inputData.risks
      })
      return {
        updated: {
          digets: updatedDigetsList.digets,
          history: updatedDigetsList.history,
          risks: inputData.risks
        },
        src : inputData
      }
    } 
    return {
      updated: {
        digets: newDigets,
        history: newHistory,
        risks: inputData.risks
      },
      src : inputData
    }
  }

  /** Обогащение основных риск факторов о кампании - риск-факторами по физикам */
  getHeadsRiskFactors = (heads, mainDigets) => {
    let { digets=[], history=[] } = mainDigets
    heads.map(item => {
      if(item.hasOwnProperty('risk_factors') && item.risk_factors.digets.length) {
        digets = concat(digets, item.risk_factors.digets.map(factor => {
          factor.object = `${item.fio} (${item.inn})`
          factor.name = item.fio
          factor.vremya_akceptovaniya_zapisi = factor.time
          factor.comment = factor.risk1
          return factor
        }))
      }
      if(item.hasOwnProperty('risk_factors') && item.risk_factors.history.length) {
        history = concat(history, item.risk_factors.history.map(factor => {
          factor.object = `${item.fio} (${item.inn})`
          factor.name = item.fio
          factor.vremya_akceptovaniya_zapisi = factor.time
          factor.comment = factor.risk1
          return factor
        }))
      }
      return item
    })
    return {
      digets: compact(digets),
      history: compact(history)
    }
  }

  _arbiterTransform = item => {
    return item = [{
      key: '1',
      name: 'Истец',
      year: item.istec.year,
      year3: item.istec.year3,
    }, {
      key: '2',
      name: 'Ответчик',
      year: item.otvet.year,
      year3: item.otvet.year3,
    }]
  };


  getUuid = arr => arr.map(item => {
    item.key = uuid()
    return item
  })

  /** Ebg utils */
  /** Подготовка данных для EBG table */
  updateEbgTable = data => {
    return data.map( (item, key) =>  {
      return {
        key: key,
        number: key+1,
        date: getTimeAndDate(item.data),
        time: moment(item.data).valueOf(),
        status: item.status,
        user: item.user,
        id: item.id,
        client_type: item.client_type,
        owner: item.owner,
        owner_detail: item.owner_detail,
        info: {
          name: item.name,
          inn: item.inn,
          ogrn: item.ogrn,
          birthday: item.birthday
        }
      }
    })
  }

  /** Иммутабельное обновление данных об руководителях на основании ebgJson */
  updateEbgHeads = props => {
    let { prevStore, managment, prevSelected } = props
    const newHeads =  managment.map(head => {
      const checkRes = head.identityDocType === "NON_RESIDENT"
      const Region = checkRes ? 
        head.actualAddress.code_region ? 
          region.find(item => item.title.toUpperCase().indexOf(getRegionTitle(head.actualAddress.region).toUpperCase()) !== -1) : 
          region.find(item => item.value === head.actualAddress.code_region) :
            head.passport.address.region ? 
              head.passport.address.code_region ? 
                region.find(item => item.value === head.passport.address.code_region) : 
                region.find(item => item.title.toUpperCase().indexOf(getRegionTitle(head.passport.address.region).toUpperCase()) !== -1) : null
      const newHead = {
        ActualDate: head.datePosition ?  head.datePosition : Date.now(),
        first_name: toFirstUpper(head.person.name),
        last_name: toFirstUpper(head.person.surname),
        middle_name: toFirstUpper(head.person.patronymic),
        inn: head.inn ? head.inn : "Не найден",
        fio: (`${toFirstUpper(head.person.surname)} ${toFirstUpper(head.person.name)} ${toFirstUpper(head.person.patronymic)}`).trim(),
        id: uuid(),
        timeRequest: Date.now(),
        organisation: {
          name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
          inn: prevStore.get("inn") ? prevStore.get("inn") : "",
          ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
        },
        position: [{
          tagName : checkRes ? 
            "Иностранный гражданин" : head.position ? head.position : "Не указан",
          organisation: {
            name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
            inn:prevStore.get("inn") ? prevStore.get("inn") : "",
            ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
          }
        }],
        newUser: true
      }
      
      prevSelected = prevSelected.set(newHead.id, {
        INN: head.inn,
        FirstName: toFirstUpper(head.person.name), 
        FirstNameArch: toFirstUpper(head.person.name),
        MiddleName: toFirstUpper(head.person.patronymic),
        SurName: toFirstUpper(head.person.surname),
        DateOfBirth: getDate(checkRes ? head.otherIdentityDoc.birthday : head.passport.birthday),
        Seria: checkRes ? "" : head.passport.series,
        Number: checkRes ? "" : head.passport.number,
        RegionExp: Region ? Region.value : "",
        CityExp: checkRes ? head.actualAddress.city : head.passport.address.city,
        StreetExp: checkRes ? head.actualAddress.street : head.passport.address.street,
        HouseExp: checkRes ? head.actualAddress.house : head.passport.address.house,
        BuildExp: "",
        BuildingExp: "",
        FlatExp: checkRes ? head.actualAddress.flat : head.passport.address.flat,
        INNArr: [head.inn],
        DateOfBirthArr: [getDate(checkRes ? head.otherIdentityDoc.birthday : head.passport.birthday)]
      })
      return newHead
    })
    return {
      heads: newHeads,
      selected: prevSelected
    }
  }

  /** Добавление уникального ключа для foundersUl */
  getEbgFoundersUlKey = props => {
    if(!props.length) return []
    else return props.map(item => {
      item.key = uuid()
      return item
    })
  }

  /** Иммутабельное обновление основыных данных об искомой кампании ЮЛ */
  updateEbgUlComSrc = (prevStore, serverData) => {
    try {
      fieldsArr.map( fieldItem => {
        for (const key in serverData) {
          if( fieldItem.search === "Predecessor" && fieldItem.func ) {
            return prevStore = prevStore.set(fieldItem.id, serverData.ps.Data ? fieldItem.func(serverData.ps.Data.Report.Reorganizations[fieldItem.search]) : "")
          } else if( fieldItem.search === "Successor" && fieldItem.func ) {
            return prevStore = prevStore.set(fieldItem.id, serverData.ps.Data ? fieldItem.func(serverData.ps.Data.Report.Reorganizations[fieldItem.search]) : "")
          } else if(fieldItem.search === key && !fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, serverData[fieldItem.search])
          } else if(fieldItem.search === key && fieldItem.func) {
            return prevStore = prevStore.set(fieldItem.id, fieldItem.func(serverData[fieldItem.search]))
          }
        }
        return fieldItem
      })

      const updateHeads = prevStore.get("heads").map(item => ({
        ...item,
        fio: (`${item.last_name} ${item.first_name} ${item.middle_name}`).trim(),
        id: uuid(),
        timeRequest: Date.now(),
        organisation: {
          name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
          inn: prevStore.get("inn") ? prevStore.get("inn") : "",
          ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
        },
        position: [{
          tagName : item.position,
          organisation: {
            name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
            inn:prevStore.get("inn") ? prevStore.get("inn") : "",
            ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : ""
          }
        }],
      }))

      prevStore = prevStore.set("heads", updateHeads)
      prevStore = prevStore.set("name", prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "")
      if(prevStore.get("arbiter").other.length) prevStore = prevStore.set("arbiter_other", prevStore.get("arbiter").other)

      if(prevStore.get("leaders_list").length) {
        const historyFl = prevStore.get("leaders_list").map(fl => ({
          id: uuid(),
          ActualDate: fl.ActualDate ? fl.ActualDate : getDate(Date.now()),
          fio: `${fl.last_name} ${fl.first_name} ${fl.middle_name}`,
          first_name: fl.first_name,
          inn: fl.inn ? fl.inn : "Не найден",
          last_name: fl.last_name,
          middle_name: fl.middle_name,
          organisation: {
            name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
            inn:prevStore.get("inn") ? prevStore.get("inn") : "",
            ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
          },
          position: [{
            tagName: fl.position,
            organisation: {
              name: prevStore.get("name") ? getShortCompName(prevStore.get("name")) : "",
              inn:prevStore.get("inn") ? prevStore.get("inn") : "",
              ogrn: prevStore.get("ogrn") ? prevStore.get("ogrn") : "",
            }
          }],
        }))
        prevStore = prevStore.set("management_history", historyFl)
      }

      prevStore.set("key")
      return prevStore
    } catch (error) {
      console.log('%cОшибка в преобразовании updateComSrc', cloCss.red, error)
    }
  }

  /** Sls utils */
  customStopListSearch = (white=[], black=[], lists = []) => {
    white.map(item1lvl => {
      const {rows, ...all} = item1lvl
      rows.map(item2lvl => {
        lists.push({ ...all, ...item2lvl, key: uuid(), search_request: "white"})
        return item2lvl
      })
      return item1lvl
    })
    black.map(item1lvl => {
      const {rows, ...all} = item1lvl
      rows.map(item2lvl => {
        lists.push({ ...all, ...item2lvl, key: uuid(), search_request: "black"})
        return item2lvl
      })
      return item1lvl
    })
    return lists
  }
}

export const trasform = new TransformData();
export default TransformData;

export const region=[{value:"01",title:"Алтайский край"},{value:"10",title:"Амурская область"},{value:"11",title:"Архангельская область"},{value:"12",title:"Астраханская область"},{value:"14",title:"Белгородская область"},{value:"15",title:"Брянская область"},{value:"17",title:"Владимирская область"},{value:"18",title:"Волгоградская область"},{value:"19",title:"Вологодская область"},{value:"20",title:"Воронежская область"},{value:"40",title:"Санкт-Петербург и Ленинградская область"},{value:"99",title:"Еврейская автономная область"},{value:"76",title:"Забайкальский край"},{value:"24",title:"Ивановская область"},{value:"25",title:"Иркутская область"},{value:"83",title:"Кабардино-Балкарская Республика"},{value:"27",title:"Калининградская область"},{value:"29",title:"Калужская область"},{value:"30",title:"Камчатский край"},{value:"91",title:"Карачаево-Черкесская Республика"},{value:"32",title:"Кемеровская область"},{value:"33",title:"Кировская область"},{value:"34",title:"Костромская область"},{value:"03",title:"Краснодарский край"},{value:"04",title:"Красноярский край"},{value:"37",title:"Курганская область"},{value:"38",title:"Курская область"},{value:"42",title:"Липецкая область"},{value:"44",title:"Магаданская область"},{value:"45",title:"Москва и Московская область"},{value:"47",title:"Мурманская область"},{value:"22",title:"Нижегородская область"},{value:"49",title:"Новгородская область"},{value:"50",title:"Новосибирская область"},{value:"52",title:"Омская область"},{value:"53",title:"Оренбургская область"},{value:"54",title:"Орловская область"},{value:"56",title:"Пензенская область"},{value:"57",title:"Пермский край"},{value:"05",title:"Приморский край"},{value:"58",title:"Псковская область"},{value:"79",title:"Республика Адыгея"},{value:"80",title:"Республика Башкортостан"},{value:"81",title:"Республика Бурятия"},{value:"82",title:"Республика Дагестан"},{value:"26",title:"Республика Ингушетия"},{value:"85",title:"Республика Калмыкия"},{value:"86",title:"Республика Карелия"},{value:"87",title:"Республика Коми"},{value:"35",title:"Республика Крым (исключая Севастополь)"},{value:"88",title:"Республика Марий Эл"},{value:"89",title:"Республика Мордовия"},{value:"98",title:"Республика Саха (Якутия)"},{value:"90",title:"Республика Северная Осетия - Алания"},{value:"92",title:"Республика Татарстан"},{value:"93",title:"Республика Тыва"},{value:"95",title:"Республика Хакасия"},{value:"60",title:"Ростовская область"},{value: "61",title:"Рязанская область"},{value: "36",title: "Самарская область"},{value:"63",title:"Саратовская область"},{value:"64",title:"Сахалинская область"},{value:"65",title:"Свердловская область"},{value:"67",title:"Севастополь город федерального значения"},{value:"66",title:"Смоленская область"},{value:"07",title:"Ставропольский край"},{value:"68",title:"Тамбовская область"},{value:"28",title:"Тверская область"},{value:"69",title:"Томская область"},{value:"70",title:"Тульская область"},{value:"71",title:"Тюменская область"},{value:"94",title:"Удмуртская Республика"},{value:"73",title:"Ульяновская область"},{value:"08",title:"Хабаровский край"},{value:"75",title:"Челябинская область"},{value:"96",title:"Чеченская Республика"},{value:"97",title:"Чувашская Республика-Чувашия"},{value:"77",title:"Чукотский автономный округ"},{value:"78",title:"Ярославская область"}]
