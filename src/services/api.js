import { getUSDate } from './utils'

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

/** Получение данных по дате рождения (стоп-листы) */
export const getStopListFlBirthdate = (user, birthdate) => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/253/stoplist_server_script?method=bases&surname=${user.last_name}&firstname=${user.first_name}&middlename=${user.middle_name}&birthdate=${getUSDate(birthdate)}&type=fl`, 
    { 
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }
  )
  .then(res => {
    if (res.ok) return res.json()
    throw new TypeError("Данные о кампании не обновлены!")
  })
}

/** Получение  данных по паспорту (стоп-листы) */
export const getStopListFlPassport = user => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/253/stoplist_server_script?method=bases&type=fl&passport=${user.Seria} ${user.Number}&series=${user.Seria}&number=${user.Number}`, 
    { 
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }
  )
  .then(res => {
    if (res.ok) return res.json()
    throw new TypeError("Данные о кампании не обновлены!")
  })
}

/** Получение  данных по ИНН (стоп-листы) */
export const getStopListFlInn = inn => {
  return fetch(
    `/cgi-bin/serg/0/6/9/reports/253/stoplist_server_script?method=bases&type=fl&inn=${inn}`, 
    { 
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
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
            FirstName: action.payload.first_name.toUpperCase(),
            MiddleName: action.payload.middle_name.toUpperCase(),
            SurName: action.payload.last_name.toUpperCase(),
            INN: action.payload.inn,
            OGRN: action.payload.organisation ? action.payload.organisation.ogrn : storeOgrn.ogrn
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
            FirstName: action.payload.first_name,
            MiddleName: action.payload.middle_name,
            SurName: action.payload.last_name,
            INNIP: action.payload.inn,
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
export const getIdentifyUserInfo = (reqnum, action, storeOgrn) => {
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
          OGRN: storeOgrn.ogrn,
          INN: action.payload.INN,
          FirstName: action.payload.FirstName,
          FirstNameArch: action.payload.FirstNameArch,
          MiddleName: action.payload.MiddleName,
          SurName:action.payload.SurName,
          DateOfBirth: action.payload.DateOfBirth,
          Seria: action.payload.Seria,
          Number: action.payload.Number,
          RegionExp: action.payload.RegionExp,
          CityExp: action.payload.CityExp,
          StreetExp: action.payload.StreetExp,
          HouseExp: action.payload.HouseExp,
          BuildExp: action.payload.BuildExp,
          BuildingExp: action.payload.BuildingExp,
          FlatExp: action.payload.FlatExp,
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