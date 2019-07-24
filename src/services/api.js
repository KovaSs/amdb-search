import { getUSDate, parsingPassport } from './utils'

/** Загрузка данных о кампании */
export const getLoadCompanyInfo = inn => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
    { 
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify({ 
        type: 'get_company_info',
        data: {
          code: inn
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
export const getAffilatesList = (id, inn) => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
    { 
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify({ 
        type: 'get_affilates',
        reqnum: id,
        data: {
          code: inn
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
export const getBlackStopList = action => {
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
        inn: action.INN,
        birthdate: getUSDate(action.DateOfBirthArr)
      }),
    }
  )
  .then(res => {
    if (res.ok) return res.json()
    throw new TypeError("Данные о кампании не обновлены!")
  })
}

/** Получение данных из белой БД (стоп-листы) */
export const getWhiteStopList = action => {
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
        inn: action.INN,
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
export const getDigestList = reqnum => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
    { 
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify({ 
        type: 'digest',
        reqnum: reqnum,
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
export const getAddRiskFactor = (reqnum, data) => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
    { 
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify({ 
        type: 'digest',
        reqnum: reqnum,
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
export const getDeleteRiskFactor = (reqnum, data) => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
    { 
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body : JSON.stringify({ 
        type: 'digest',
        reqnum: reqnum,
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
export const getRequestAffiliatesUl = (reqnum, inn) => {
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
          code: inn
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
export const getIdentifyUser = (ip, reqnum, action, storeOgrn) => {
  console.log('IDENTYFY', action)
  if(!ip) {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'identify_user',
          reqnum: reqnum,
          data: {
            FirstName: action.FirstName,
            MiddleName: action.MiddleName,
            SurName: action.SurName,
            INN: action.INN,
            OGRN: action.ogrn ? action.ogrn : storeOgrn.ogrn,
            DateOfBirth: action.DateOfBirth,
            Seria: action.Seria,
            Number: action.Number,
          }
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  } else {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'identify_user',
          reqnum: reqnum,
          data: {
            FirstName: action.first_name,
            MiddleName: action.middle_name,
            SurName: action.last_name,
            INNIP: action.inn,
            DateOfBirth: action.birthdate,
            Seria: action.passport ? parsingPassport(action.passport).Seria : "",
            Number: action.passport ? parsingPassport(action.passport).Number : "",
          }
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
export const getIdentifyUserInfo = (reqnum, action) => {
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
          INNExp: action.INN,
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
          HouseExp: action.HouseExp,
          BuildExp: action.BuildExp,
          BuildingExp: action.BuildingExp,
          FlatExp: action.FlatExp,
          AFF: 1,
          Exp: 1,
          ExpArch: 1
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
export const getFsspInfo = (reqnum, action) => {
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
          FirstName: action.FirstName,
          MiddleName: action.MiddleName,
          SurName:action.SurName,
          DateOfBirth: action.DateOfBirth,
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
export const getStopListsUlInfo = inn => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
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