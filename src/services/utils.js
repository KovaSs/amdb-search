import { cloneDeep, assign, concat } from 'lodash';
import moment from 'moment'
import { fieldsArr, fieldsArrIP } from "./fields";

/** Стили для консольных команд */
export const cloCss = { 
  red: "color: white; background-color: red; padding: 0 5px",
  green: "color: white; background-color: green; padding: 0 5px",
  yellow: "color: black; background-color: yellow; padding: 0 5px",
}

/* Парсинг ФИО */
export const  parsingFio = fio => {
  const fioArr = fio.split(" ")
  const MiddleName = fioArr.pop()
  const FirstName = fioArr.pop()
  const SurName = String(fioArr)
  return { FirstName, MiddleName, SurName }
}

/** Получение данных из БД (стоп-листы) */
export const getLists = (obj, base="", table="", content=[]) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      base = key
      for (const id in obj[key]) {
        if (obj[key].hasOwnProperty(id)) {
          table = id;
          content = obj[key][id].rows.map(item => item.filter(el => el !== "" && el !== null && el !== "!^!  \r"))
        }
      }
    }
  }
  return {base, table, content}
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

/** Генерация uuId ключей */
// eslint-disable-next-line
export const sumTrans = str => str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + '\u200A')
/** Генерация Id ключей */
// eslint-disable-next-line
export const uuid = ()=> ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15 >> c/4).toString(16));

/** Преобразование даты к формату DD.MM.YYYY */
export const getDate = data =>  moment(data).format('DD.MM.YYYY')

/** Поличение текущей даты в формате DD.MM.YYYY */
export const getNowDate = () =>  new Date(Date.now()).toLocaleString().split(", ")[0]

/** Преобразование даты к формату DD.MM.YYYY h:mm:ss */
export const getTimeAndDate = data =>  moment(data).format('DD.MM.YYYY h:mm:ss')

/** Преобразование даты к формату YYYY-MM-DD */
export const getUSDate = arr => {
  const dateArrUs = arr.map(item => {
    const dateArr = item.split(".")
    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
  })
  return dateArrUs
}

/** Преобразование имени кампании к укороченной версии */
export const getShortCompName = name => {
return name
.replace(/^Общество с ограниченной ответственностью/gi, 'ООО')
.replace(/^Публичное акционерное общество/gi, 'ПАО')
.replace(/^Закрытое акционерное общество/gi, 'ПАО')
.replace(/^Открытое акционерное общество/gi, 'ОАО')
.replace(/^Акционерное общество/gi, 'АО')
.replace(/^МЕСТНАЯ РЕЛИГИОЗНАЯ ОРГАНИЗАЦИЯ/gi, 'МРО')
.replace(/ОРТОДОКСАЛЬНОГО ИУДАИЗМА/gi, 'ОИ')
.replace(/ОДИНЦОВСКОГО РАЙОНА/gi, 'ОР')
.replace(/МОСКОВСКОЙ ОБЛАСТИ/gi, 'МО')
.replace(/Финансово-Промышленная корпорация/gi, 'ФПК')
.replace(/Управляющая компания/gi, 'УК')
}

export const htmlTransform = str => {
return str
  .replace(/id="header"/g, 'id="header" style="display:none"')
  .replace(/id="paper"/g, 'id="paper" style="padding-top:0; border: 0; margin-left: 0; margin-right: 0; box-shadow: none;"')
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

export const htmlEmpty = str => {
  return str
  .indexOf(/<span>Распечатать<\/span>/g, '')
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
  _transformAllData = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {      
      const _arbiterTransform = item => {
        return item = [{
          key: '1',
          name: 'Истец',
          year: item.istec.year,
          year3: item.istec.year3,
        }, {
          key: '2',
          name: 'Ответчик',
          year: item.otvet.year,
          year3: item.otvet.year,
        }]
      };

      const _headersTransform = item => {
        let i=0, newArr =[]
        item.map( elem => {
          newArr.push({
            key: i,
            fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
            inn: elem.inn,
          })
          i++
          return newArr
        })
        return newArr
      };

      for (const el in inputData) {
        if(item.id === el && item.id === "arbiter") {
          let newData = _arbiterTransform(inputData[el])
          clgData[el] = new Field(item.search, item.title, newData)
          return assign(item, { "data" : newData})
        } else if(item.id === el && item.id === "heads") {
          let newData = _headersTransform(inputData[el])
          clgData[el] = new Field(item.search, item.title, newData)
          return assign(item, { "data" : newData})
        } else if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    // console.table(clgData)
    return fullOrganistionInfo
  }

  _companySource = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    return fullOrganistionInfo
  }

  _get_company_info_companySource = (prevData, newData) => {
    try {
      const clonePrevData = cloneDeep(prevData);
        fieldsArr.map(item => {
          for (const key in newData) {
            if(item.search === "Predecessor" && item.func ) return assign(clonePrevData, { [item.id] : newData.ps.Data ? item.func(newData.ps.Data.Report.Reorganizations[item.search]) : ""})
            else if(item.search === "Successor" && item.func ) return assign(clonePrevData, { [item.id] : newData.ps.Data ? item.func(newData.ps.Data.Report.Reorganizations[item.search]) : ""})
            else if(item.search === key && !item.func) return assign(clonePrevData, { [item.id] : newData[item.search]})
            else if(item.search === key && item.func)return assign(clonePrevData, { [item.id] : item.func(newData[item.search])})
          }
          return item
        })

      const updateHeads = clonePrevData.heads.map(item => ({
        ...item,
        fio: `${item.last_name} ${item.first_name} ${item.middle_name}`,
        id: uuid(),
        timeRequest: Date.now(),
        organisation: {
          name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
          inn: clonePrevData.inn ? clonePrevData.inn : "",
          ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
        },
        position: [{
          tagName : item.position,
          organisation: {
            name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
            inn: clonePrevData.inn ? clonePrevData.inn : "",
            ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
          }
        }],
      }))
      clonePrevData.heads = updateHeads
      clonePrevData.name = clonePrevData.name ? getShortCompName(clonePrevData.name) : ""
      if(clonePrevData.arbiter.other.length) {
        clonePrevData.arbiter_other = clonePrevData.arbiter.other
      }
      return clonePrevData
    } catch (error) {
      console.log('%cОшибка в преобразовании company_type', cloCss.red, error)
    }
  }

  _addNewUserToCheckList = (prevData, newData) => {
    const clonePrevData = cloneDeep(prevData);
    clonePrevData.heads.push(newData)
    return clonePrevData
  }

  _companySource_ip = (prevData, newData) => {
    const clonePrevData = cloneDeep(prevData);
    fieldsArrIP.map(item => {
      for (const key in newData) {
        if(item.search === key && !item.func) return assign(clonePrevData, { [item.id] : newData[item.search]})
        else if(item.search === key && item.func)return assign(clonePrevData, { [item.id] : item.func(newData[item.search])})
      }
      return item
    })
    
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
            name: clonePrevData.name ? getShortCompName(clonePrevData.full_name) : "",
            inn: clonePrevData.inn ? clonePrevData.inn : "",
            ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
          }
        }], 
        inn, 
        ActualDate: date,
        timeRequest: Date.now(),
        organisation: {
          name: "Индивидуальный предприниматель",
          inn: clonePrevData.inn ? clonePrevData.inn : "",
          ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
        }
      }
    }
    clonePrevData.heads = [addHeds(clonePrevData.full_name, clonePrevData.inn, clonePrevData.registration_date)]
    if(clonePrevData.arbiter.other.length) {
      clonePrevData.arbiter_other = clonePrevData.arbiter.other
    }
    return clonePrevData
  }

  _stop_lists = (prevData, lists, id) => {
    const clonePrevData = cloneDeep(prevData);
    clonePrevData.heads.map(item => {
      if(item.id === id) {
        item.timeRequest = Date.now()
        item.stop_lists = item.stop_lists ? concat(item.stop_lists, lists) : concat([], lists)
      }
      return item
    })
    return clonePrevData
  }

  _identifyUserInfo = (prevData, newData, inn) => {
    const clonePrevData = cloneDeep(prevData);
    clonePrevData.heads.map( item =>  {
      if(item.inn === inn) {
        item.timeRequest = Date.now()
        item.identifyInfo = newData
      }
      return item
    })
    return clonePrevData
  }

  _managementSource = inputData => {
    const Field = (search, title, data) => ({ search, title, data })
    let clgData = {}
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const fullOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgData[el] = new Field(item.search, item.title, inputData[el])
          return assign(item, { "data" : inputData[el]})
        }
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

  _updateManagmentSource = (prevData, newData) => {
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const clonePrevData = cloneDeep(prevData);

    cloneFieldsArr.map( item => {
      for (const el in newData) {
        if( item.search === el && 
          ( 
            item.search === "founders_fl" || 
            item.search === "founders_ul" || 
            item.search === "ul" || 
            item.search === "fl" ||
            item.search === "heads_ul" ||
            item.search === "heads_fl" ||
            item.search === "share_holders_fl" ||
            item.search === "share_holders_ul"
          ) 
            && el.func) {
          return assign(clonePrevData, { [item.id] : item.func(newData[item.search])})
        } else if( item.search === el && 
          ( 
            item.search === "founders_fl" ||
            item.search === "founders_ul" ||
            item.search === "ul" ||
            item.search === "fl" ||
            item.search === "heads_ul" ||
            item.search === "heads_fl" ||
            item.search === "share_holders_fl" ||
            item.search === "share_holders_ul"
          ) 
            && !el.func) {
          return assign(clonePrevData, { [item.id] : newData[item.search]})
        }
      }
      return item
    })
    // Учредители
    if( newData.founders_fl.length ) {
      let notFoundsHeadsFl = []
      const updatedHeads = clonePrevData.heads.map( heads => {
        if( newData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio).length) {
          const newHeadInfo = newData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio)[0]
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Учредитель`,
                organisation: {
                  name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
                  inn: clonePrevData.inn ? clonePrevData.inn : "",
                  ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
                },
                share: newHeadInfo.share
              }
            )
          }
        }
        return heads
      })
      newData.founders_fl.map(founders_fl => {
        if(!clonePrevData.heads.filter(head => head.fio === founders_fl.fio).length) {
          return notFoundsHeadsFl.push({
            id: uuid(),
            ActualDate: founders_fl.date ? founders_fl.date : getDate(Date.now()),
            fio: founders_fl.fio,
            first_name: parsingFio(founders_fl.fio).FirstName,
            inn: founders_fl.innfl ? founders_fl.innfl : "Не найден",
            last_name: parsingFio(founders_fl.fio).SurName,
            middle_name: parsingFio(founders_fl.fio).MiddleName,
            organisation: {
              name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
              inn: clonePrevData.inn ? clonePrevData.inn : "",
              ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
            },
            position: [{
              tagName: `Учредитель`,
              organisation: {
                name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
                inn: clonePrevData.inn ? clonePrevData.inn : "",
                ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
              },
              share: founders_fl.share
            }],
          })
        }
        return null
      })
      clonePrevData.heads = concat(updatedHeads, notFoundsHeadsFl)
      console.log(`%c1lvl FOULDERS_FL | ${clonePrevData.name ? getShortCompName(clonePrevData.name) : ""}`, cloCss.yellow, clonePrevData.heads)
    }

    // Акционеры
    if(newData.share_holders_fl.length) {
      let notFoundsShareHoldersFl = []
      const headPerson = clonePrevData.heads.map( heads => {
        if(newData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio).length) {
          const newInfo = newData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio)[0]
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Акционер`,
                organisation: {
                  name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
                  inn: clonePrevData.inn ? clonePrevData.inn : "",
                  ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : "",
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
      newData.share_holders_fl.map(share_holders_fl => {
        if(!clonePrevData.heads.filter(head => head.fio === share_holders_fl.fio).length) {
          return notFoundsShareHoldersFl.push({
            id: uuid(),
            ActualDate: share_holders_fl.date ? share_holders_fl.date : getDate(Date.now()),
            fio: share_holders_fl.fio,
            first_name: parsingFio(share_holders_fl.fio).FirstName,
            inn: share_holders_fl.innfl ? share_holders_fl.innfl : "Не найден",
            last_name: parsingFio(share_holders_fl.fio).SurName,
            middle_name: parsingFio(share_holders_fl.fio).MiddleName,
            organisation: {
              name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
              inn: clonePrevData.inn ? clonePrevData.inn : "",
              ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
            },
            position: [{
              tagName: `Акционер`,
              organisation: {
                name: clonePrevData.name ? getShortCompName(clonePrevData.name) : "",
                inn: clonePrevData.inn ? clonePrevData.inn : "",
                ogrn: clonePrevData.ogrn ? clonePrevData.ogrn : ""
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
      clonePrevData.heads = concat(headPerson, notFoundsShareHoldersFl)
      console.log(`%c1lvl SHARE_HOLDERS_FL | ${clonePrevData.name ? getShortCompName(clonePrevData.name) : ""}`, cloCss.yellow, clonePrevData.heads)
    }
    return clonePrevData
  }

  /** Обновление информации по Связанным лицам, если это ЮЛ */
  updateManagmentULSource = (prevData, newData, user) => {
    const clonePrevData = cloneDeep(prevData)
    // Руководство
    if(newData.heads_fl.length) {
      let notFoundsHeadsFl = []
      const headPerson = clonePrevData.heads.map( (heads, i) => {
        if( newData.heads_fl.filter(heads_fl => heads.fio === heads_fl.fio).length) {
          const updatedHead = newData.heads_fl.filter(heads_fl => heads.fio === heads_fl.fio)[0]
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: updatedHead.position,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : "",
                  ogrn: user.ogrn ? user.ogrn : "",
                  address: user.address ? user.address : "",
                },
                share: {
                  capitalSharesPercent: user.capitalSharesPercent,
                  votingSharesPercent: user.votingSharesPercent,
                }
              }
            )
          }
        }
        return heads
      })
      newData.heads_fl.map(heads_fl => {
        if(!clonePrevData.heads.filter( heads => heads.fio === heads_fl.fio).length) {
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
              inn: user.inn ? user.inn : "",
              ogrn: user.ogrn ? user.ogrn : ""
            },
            position: [{
              tagName: heads_fl.position,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : "",
                ogrn: user.ogrn ? user.ogrn : "",
                address: user.address ? user.address : "",
              },
              share: {
                capitalSharesPercent: user.capitalSharesPercent,
                votingSharesPercent: user.votingSharesPercent,
              }
            }],
          })
        }
        return null
      })
      clonePrevData.heads = concat(headPerson, notFoundsHeadsFl)
      console.log(`%c2lvl HEADS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, clonePrevData.heads)
    }

    // Учредители
    if(newData.founders_fl.length) {
      let notFoundsFoundersFl = []
      const updatedHeads = clonePrevData.heads.map( heads => {
        if( newData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio).length) {
          // const updatedHead = newData.founders_fl.filter(founders_fl => heads.fio === founders_fl.fio)[0]
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Учредитель`,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : "",
                  ogrn: user.ogrn ? user.ogrn : ""
                },
                share: user.share
              }
            )
          }
        }
        return heads
      })
      newData.founders_fl.map(founders_fl => {
        if(!clonePrevData.heads.filter( heads => founders_fl.fio === heads.fio).length) {
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
              inn: user.inn ? user.inn : "",
              ogrn: user.ogrn ? user.ogrn : ""
            },
            position: [{
              tagName: `Учредитель`,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : "",
                ogrn: user.ogrn ? user.ogrn : ""
              },
              share: user.share
            }],
          })
        }
        return null
      })
      clonePrevData.heads = concat(updatedHeads, notFoundsFoundersFl)
      console.log(`%c2lvl FOULDERS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, clonePrevData.heads)
    }

    // Акционеры
    if(newData.share_holders_fl.length) {
      let notFoundsShareHoldersFl = []
      const headPerson = clonePrevData.heads.map( heads => {
        if(newData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio).length) {
          const newInfo = newData.share_holders_fl.filter(share_holders_fl => heads.fio === share_holders_fl.fio)[0]
          return {
            ...heads,
            position: concat(
              heads.position,
              {
                tagName: `Акционер (${newInfo.capitalSharesPercent ? `${newInfo.capitalSharesPercent}` : ""}${newInfo.votingSharesPercent ? ` / ${newInfo.votingSharesPercent}` : ""})`,
                organisation: {
                  name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                  inn: user.inn ? user.inn : "",
                  ogrn: user.ogrn ? user.ogrn : "",
                  address: user.address ? user.address : "",
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
      newData.share_holders_fl.map(share_holders_fl => {
        if(!clonePrevData.heads.filter(head => head.fio === share_holders_fl.fio).length) {
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
              inn: user.inn ? user.inn : "",
              ogrn: user.ogrn ? user.ogrn : "",
              address: user.address ? user.address : "",
            },
            position: [{
              tagName: `Акционер`,
              organisation: {
                name: user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name),
                inn: user.inn ? user.inn : "",
                ogrn: user.ogrn ? user.ogrn : "",
                address: user.address ? user.address : "",
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
      clonePrevData.heads = concat(headPerson, notFoundsShareHoldersFl)
      console.log(`%c2lvl SHARE_HOLDERS_FL | ${user.fullName ? getShortCompName(user.fullName) : getShortCompName(user.name)}`, cloCss.yellow, clonePrevData.heads)
    }
    return clonePrevData
  }

  _riskSource = inputData => {
    const Risk = (search, title, data) => ({ search, title, data })
    let clgRiskData = {}
    const cloneFieldsArr = cloneDeep(fieldsArr);
    const riskOrganistionInfo = cloneFieldsArr.map( item => {
      for (const el in inputData) {
        if(item.id === el ) {
          clgRiskData[el] = new Risk(item.search, item.title, inputData[el])
          return assign(item, { "data" : inputData[el]})
        }
      }
      return item
    })
    // console.table(clgRiskData)
    return riskOrganistionInfo
  }

  _headersTransform = item => {
    let i=0, newArr =[]
    item.map( elem => {
      newArr.push({
        key: i,
        fio: `${elem.sur_name} ${elem.first_name} ${elem.last_name}`,
        inn: elem.inn,
      })
      i++
      return newArr
    })
    return newArr
  };

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
      year3: item.otvet.year,
    }]
  };
}

export const trasform = new TransformData();
export default TransformData;

export const region=[{value:"01",title:"Республика Алтай"},{value:"10",title:"Амурская область"},{value:"11",title:"Архангельская область"},{value:"12",title:"Астраханская область"},{value:"14",title:"Белгородская область"},{value:"15",title:"Брянская область"},{value:"17",title:"Владимирская область"},{value:"18",title:"Волгоградская область"},{value:"19",title:"Вологодская область"},{value:"20",title:"Воронежская область"},{value:"40",title:"Санкт-Петербург и Ленинградская область"},{value:"99",title:"Еврейская автономная область"},{value:"76",title:"Забайкальский край"},{value:"24",title:"Ивановская область"},{value:"25",title:"Иркутская область"},{value:"83",title:"Кабардино-Балкарская Республика"},{value:"27",title:"Калининградская область"},{value:"29",title:"Калужская область"},{value:"30",title:"Камчатский край"},{value:"91",title:"Карачаево-Черкесская Республика"},{value:"32",title:"Кемеровская область"},{value:"33",title:"Кировская область"},{value:"34",title:"Костромская область"},{value:"03",title:"Краснодарский край"},{value:"04",title:"Красноярский край"},{value:"37",title:"Курганская область"},{value:"38",title:"Курская область"},{value:"42",title:"Липецкая область"},{value:"44",title:"Магаданская область"},{value:"45",title:"Москва и Московская область"},{value:"47",title:"Мурманская область"},{value:"22",title:"Нижегородская область"},{value:"49",title:"Новгородская область"},{value:"50",title:"Новосибирская область"},{value:"52",title:"Омская область"},{value:"53",title:"Оренбургская область"},{value:"54",title:"Орловская область"},{value:"56",title:"Пензенская область"},{value:"57",title:"Пермский край"},{value:"05",title:"Приморский край"},{value:"58",title:"Псковская область"},{value:"79",title:"Республика Адыгея"},{value:"80",title:"Республика Башкортостан"},{value:"81",title:"Республика Бурятия"},{value:"82",title:"Республика Дагестан"},{value:"26",title:"Республика Ингушетия"},{value:"85",title:"Республика Калмыкия"},{value:"86",title:"Республика Карелия"},{value:"87",title:"Республика Коми"},{value:"35",title:"Республика Крым (исключая Севастополь)"},{value:"88",title:"Республика Марий Эл"},{value:"89",title:"Республика Мордовия"},{value:"98",title:"Республика Саха (Якутия)"},{value:"90",title:"Республика Северная Осетия - Алания"},{value:"92",title:"Республика Татарстан"},{value:"93",title:"Республика Тыва"},{value:"95",title:"Республика Хакасия"},{value:"60",title:"Ростовская область"},{value:"63",title:"Саратовская область"},{value:"64",title:"Сахалинская область"},{value:"65",title:"Свердловская область"},{value:"67",title:"Севастополь город федерального значения"},{value:"66",title:"Смоленская область"},{value:"07",title:"Ставропольский край"},{value:"68",title:"Тамбовская область"},{value:"28",title:"Тверская область"},{value:"69",title:"Томская область"},{value:"70",title:"Тульская область"},{value:"71",title:"Тюменская область"},{value:"94",title:"Удмуртская Республика"},{value:"73",title:"Ульяновская область"},{value:"08",title:"Хабаровский край"},{value:"75",title:"Челябинская область"},{value:"96",title:"Чеченская Республика"},{value:"97",title:"Чувашская Республика-Чувашия"},{value:"77",title:"Чукотский автономный округ"},{value:"78",title:"Ярославская область"}]
