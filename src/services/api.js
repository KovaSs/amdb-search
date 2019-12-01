import { getUSDate, compactObj, formData, houseNum } from './utils'
import { base } from '../base';

const getFBData = dataName =>  
  base
    .fetch(dataName, { context: this, asArray: false })
    .then(data => data)
    .catch(err => err)

export class API {
  static useFireBaseApi = process.env.REACT_APP_USE_FIREBASE_API
  /** Загрузка данных о кампании */
  static getLoadCompanyInfo = (inn, type) => {
    if(this.useFireBaseApi) return getFBData('ipResMock')
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'get_company_info',
          data: {
            code: inn,
            digest_type: type
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Загрузка данных о аффилированных лицах */
  static getAffilatesList = (reqnum, inn, type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'get_affilates',
          reqnum,
          data: {
            code: inn,
            digest_type: type
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных из скрытой БД (стоп-листы) */
  static getBlackStopList = action => {
    return fetch(
      `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: action.SurName,
          firstname: action.FirstName,
          middlename: action.MiddleName,
          series: action.Seria,
          number: action.Number,
          inn: action.INNArr,
          birthdate: getUSDate(action.DateOfBirthArr)
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных из скрытой БД (стоп-листы) */
  static getStopListFl = (action, reqnum, type) => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl", 
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({
          data: {
            type: 'fl',
            method: 'bases',
            surname: action.SurName,
            firstname: action.FirstName,
            middlename: action.MiddleName,
            series: action.Seria,
            number: action.Number,
            inn: action.INNArr,
            birthdate: getUSDate(action.DateOfBirthArr),
            digest_type: type
          },
          reqnum,
          type: "stoplist"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных из белой БД (стоп-листы) */
  static getWhiteStopList = action => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: action.SurName,
          firstname: action.FirstName,
          middlename: action.MiddleName,
          series: action.Seria,
          number: action.Number,
          inn: action.INNArr,
          birthdate: getUSDate(action.DateOfBirthArr)
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение  данных  о риск факторах для дайджеста */
  static getDigestList = (reqnum = "666", digest_type=4) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest',
          reqnum: reqnum,
          digest_type,
          data: {}
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Добавление нового риск фактора в дайджест */
  static getAddRiskFactor = (reqnum, data, digest_type) => {  
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Редактирование риск фактора из дайджеста */
  static editRiskFactorRequest = (reqnum, data, digest_type) => {  
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Удаление нового риск фактора в дайджест */
  static getDeleteRiskFactor = (reqnum, data, digest_type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных о аффилированных лицах */
  static getRequestAffiliatesUl = (reqnum, inn, digetsType) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'get_affilates',
          reqnum: reqnum,
          data: {
            code: inn,
            digest_type: digetsType
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение первоначальных идентификационных данных о проверяемом лице */
  static getIdentifyUser = (ip, reqnum, action, storeOgrn) => {
    console.log('IDENTYFY', action)
    if(!ip) {
      const compact = compactObj({
        FirstName: action.FirstName,
        MiddleName: action.MiddleName,
        SurName: action.SurName,
        INN: action.INN,
        OGRN: action.ogrn ? action.ogrn : storeOgrn.ogrn,
        DateOfBirth: action.DateOfBirth,
        Seria: action.Seria,
        Number: action.Number,
        Address: `${
          action.RegionExp ? action.RegionExp : "" }${
          action.CityExp ? " " + action.CityExp.toUpperCase() : "" }${
          action.StreetExp ? " " + action.StreetExp.toUpperCase() : "" }${
          action.HouseExp ? " " + houseNum(action.HouseExp) : ""
        }`
      })
      return fetch(
        `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
        { 
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body : JSON.stringify({ 
            type: 'identify_user',
            reqnum: reqnum,
            data: compact
          }),
        }
      )
      .then(res => {
        if (res.ok) return res.json()
        throw new TypeError("Ошибка получения данных!")
      })
    } else {
      const compact = compactObj({
        FirstName: action.FirstName,
        MiddleName: action.MiddleName,
        SurName: action.SurName,
        INNIP: action.INN,
        DateOfBirth: action.DateOfBirth,
        Seria: action.Seria,
        Number: action.Number,
        Address: `${
          action.RegionExp ? action.RegionExp : "" }${
          action.CityExp ? " " + action.CityExp.toUpperCase() : "" }${
          action.StreetExp ? " " + action.StreetExp.toUpperCase() : "" }${
          action.HouseExp ? " " + houseNum(action.HouseExp) : ""
        }`
      })
      return fetch(
        `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
        { 
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body : JSON.stringify({ 
            type: 'identify_user',
            reqnum: reqnum,
            data: compact
          }),
        }
      )
      .then(res => {
        if (res.ok) return res.json()
        throw new TypeError("Ошибка получения данных!")
      })
    }
  }

  /** Полная получение данных из Croinform на проверяемое лицо */
  static getIdentifyUserInfo = (reqnum, action, type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'request_user',
          reqnum: reqnum,
          data: {
            INNExp: action.INN && action.INN !== "Не указан"  ? action.INN : "",
            FirstName: action.FirstName,
            FirstNameArch: action.FirstNameArch,
            MiddleName: action.MiddleName,
            SurName:action.SurName,
            DateOfBirth: action.DateOfBirth,
            Seria: action.Seria,
            Number: action.Number,
            RegionExp: action.RegionExp,
            CityExp: action.CityExp,
            StreetExp: action.StreetExp,
            HouseExp: houseNum(action.HouseExp),
            // BuildExp: action.BuildExp,
            // BuildingExp: action.BuildingExp,
            // FlatExp: action.FlatExp,
            AFF: 1,
            Exp: 1,
            ExpArch: 1,
            digest_type: type
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  /** Получение данных ФССП */
  static getFsspInfo = (reqnum, action, digetsType) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fssp',
          reqnum: reqnum,
          data: {
            ...action,
            HouseExp: houseNum(action.HouseExp),
            digest_type: digetsType
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  /** Получение данных ФССП */
  static getStopListsUlInfo = inn => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'ul', 
          method: 'bases',
          ulinn: inn
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  /** Получение данных ФССП */
  static getStopLists = (data, reqnum, type) => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          data: {
            ...data,
            digest_type: type
          },
          reqnum,
          type: "stoplist"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  /** Получение данных по найденным риск-факторам о ФЛ */
  static getRiskFactorsFl = (reqnum, user, digest_type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({
          type:"digest_fl_search",
          digest_type,
          reqnum,
          data:{
            SurName: user.last_name,
            FirstName: user.first_name,
            MiddleName: user.middle_name,
            DateOfBirth:"",
            Seria:"",
            Number:"",	
            INN: user.inn !== "Не найден" ? user.inn : ""
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Редактирование риск фактора Fl из дайджеста */
  static editRiskFactorFlRequest = (reqnum, data, digest_type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest_fl_edit',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Добавление нового риск фактора в дайджест */
  static getAddRiskFactorFl = (reqnum, data, digest_type) => {
    console.log('data', data)
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest_fl_write',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data,
            INN: data.INN !== "Не найден" ? data.INN : ""
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Удаление нового риск фактора в дайджест */
  static getDeleteRiskFactorFl = (reqnum, data, digest_type) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'digest_fl_delete',
          reqnum: reqnum,
          digest_type,
          data: {
            ...data
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Запрос приложенных к заявке документов */
  static getDocuments = (reqnum, inn) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta_fkdo.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'get_fkdo_info',
          reqnum: reqnum,
          data: { inn }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение выбранного документа для отображения */
  static getDocumentItem = (reqnum, xhdoc) => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta_fkdo.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        "Content-Type": "aplication/pdf",
        body : JSON.stringify({ 
          type: 'fkdo_load_file',
          reqnum: reqnum,
          data: { xhdoc: xhdoc }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.blob()
        .then(blob => URL.createObjectURL(blob))
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Запрос данных для отображения таблицы "Система раннего предупреждения" */
  static getEwsData = data => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_server.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : formData(data),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Запрос данных для таблицы ЕБГ */
  static getEbgSyncData = () => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/ebg_get_queues.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных по взятому в работу элементу */
  static getEbgDataItemInfo = data => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/ebg_queue_detail.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ 
          ...data
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Взятие в работу выбранного объекта */
  static takeEbgItemToWork = inn => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/ebg_change_status.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          inn,
          action: "take_to_work"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Возврат в очередь Ebg проверки */
  static returnEbgItemToQueue = inn => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/ebg_change_status.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          inn,
          action: "return_queue"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Акцептирование Ebg объекта проверки */
  static acceptEbgItem = inn => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/276/ebg_change_status.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          inn,
          action: "accept"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных из белой БД (стоп-листы) для кастомного поиска */
  static getSearchStopListWhite = (data, type) => {
    return fetch(
      "/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search_all.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type,
          method: 'bases',
          ...data
        }),
      }
    )
    .then(res => {
      if(res.status !== 200) return {
        Response: [],
        Status: "Error"
      }
      else if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }

  /** Получение данных из скрытой БД (стоп-листы) для кастомного поиска*/
  static getSearchStopListBlack = (data, type) => {
    return fetch(
      "/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_all.pl", 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type,
          method: 'bases',
          ...data
        }),
      }
    )
    .then(res => {
      if(res.status !== 200) return {
        Response: [],
        Status: "Error"
      }
      else if (res.ok) return res.json()
      throw new TypeError("Данные о кампании не обновлены!")
    })
  }
}