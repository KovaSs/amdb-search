import {getDate, parsingFio, sumTrans} from './utils'


export const fieldsArr = [
  {search: "ShortNameRus", id: "name", title: "Сокрашеное наименование", data: "", func: item => item.replace(/\\/g, "")},

  {search: "FullNameRus", id: "full_name", title: "Полное наименование", data: "", func: item => item.replace(/\\/g, "")},

  {search: "INN", id: "inn", title: "ИНН", data: ""},

  {search: "OGRN", id: "ogrn", title: "ОГРН", data: ""},

  {search: "type", id: "company_type", title: "Тип компании", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      return item
    } catch {
      console.log('Ошибка в преобразовании company_type', item)
    }
  }},

  {search: "DateFirstReg", id: "registration_date", title: "Дата регистрации", data: "", func: (item = 'Данные отсутствуют') => getDate(item)},

  {search: "Status", id: "status", title: "Статус", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      return `${item.Code} / ${getDate(item.Date)} / ${item.GroupName}`
    } catch {
      console.log('Ошибка в преобразовании company_type', item)
    }
  }},

  {search: "OKVED2List", id: "okved", title: "Основной ОКВЭД", data: "",func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      if(Array.isArray(item.OKVED)) {
        const okved = item.OKVED.filter(el =>  el.IsMain === 'true')
        const { Code, Name } = okved[0]
        return `${Code} / ${Name}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании okved', item, error)
    }
  }},

  {search: "CompanySizeStr", id: "company_size", title: "Размер компании", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      else if(item === " / ") return ""
      else return item
    } catch {
      console.log('Ошибка в преобразовании company_type', item)
    }
  }},

  {search: "LegalAddresses", id: "address", title: "Юридический адрес", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      const { Address } = item
      if(Array.isArray(item.Address)) return Address[0].Address
      else return Address.Address
    } catch {
      console.log('Ошибка в преобразовании company_type', item)
    }
  }},

  {search: "PreviousAddress", id: "previous_address", title: "Предыдущие адреса", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      const { Address } = item
      if(Array.isArray(Address)) {
        const addressArr = Address.map(address => `${address.ActualDate} / ${address.Address}`)
        return addressArr
      }
      else return Address.Address
    } catch (error) {
      console.log('Ошибка в преобразовании previous_address', item, error)
    }
  }},

  {search: "PhoneList", id: "phone_list", title: "Список телефонов", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
        return item.Phone
    } catch (error) {
      console.log('Ошибка в преобразовании previous_address', item, error)
    }
  }},

  {search: "WorkersRange", id: "workers_range", title: "Численность персонала", data: ""},

  {search: "StaffNumberFTS", id: "workers_range_fns", title: "Численность персонала по данным ФНС", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      const { Number: {ActualDate, content}} = item
      return `${content} / ${getDate(ActualDate)}`
    } catch (error) {
      console.log('Ошибка в преобразовании workers_range_fns', item, error)
    }
  }},

  {search: "CharterCapital", id: "capital", title: "Уставной капитал", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      // eslint-disable-next-line
      return sumTrans(item)
    } catch (error) {
      console.log('Ошибка в преобразовании capital', item, error)
    }
  }},

  {search: "IndexOfDueDiligenceStr", id: "index_of_due_diligence", title: "Индекс должной осмотрительности", data: ""},

  {search: "PaymentIndexStr", id: "payment_index", title: "Индекс платежной дисциплины", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      else if(item === " / ") return ""
      else return item
    } catch (error) {
      console.log('Ошибка в преобразовании payment_index', item, error)
    }
  }},

  {search: "FailureScoreStr", id: "failure_score", title: "Индекс финансового риска", data: ""},

  {search: "Predecessor", id: "precessors", title: "Предшедственники", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item)) {
        const predecessor = []
        item.map(el =>  {
          return predecessor.push(`${el.Name} / ${el.INN} ${el.Status.Text ? `/ ${el.Status.Text}` : ''}`)
        })
        return predecessor
      } else {
        const { INN, Name, Status } = item
        return `${Name} / ${INN} ${Status.Text ? `/ ${Status.Text}` : ''}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании arbiter', item, error)
    }
  }}, 

  {search: "Successor", id: "successors", title: "Преемники", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.Successor)) {
        const successor = []
        item.map(el =>  {
          return successor.push(`${el.Name} / ${el.INN} ${el.Status.Text ? `/ ${el.Status.Text}` : ''}`)
        })
        return successor
      } else {
        const { INN, Name, Status } = item
        return `${Name} / ${INN} ${Status.Text ? `/ ${Status.Text}` : ''}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании arbiter', item, error)
    }
  }},

  {search: "Email", id: "email", title: "E-mail", data: ""},

  {search: "Www", id: "site", title: "Сайт", data: ""},

  {search: "arbitrazh", id: "arbiter", title: "Арбитраж", data: "", func: item => {
    try {
      if(!item) return ''
      const arbiter = {
        "istec":{
          "year": item.istec[0],
          "year3": item.istec[1]
        },
        "otvet":{
          "year": item.otvetchik[0],
          "year3": item.otvetchik[0]
        },
        "other": item.prochee ? item.prochee : ""
      }
      return arbiter
    } catch (error) {
      console.log('Ошибка в преобразовании arbiter', item, error)
    }
  }},

  {search: "", id: "arbiter_other", title: "Арбитраж прочее", data: ""},

  {search: "ispolnitelnye_proizvodstva", id: "isponlit_proizvodstva", title: "Исполнительные производства", data: ""},
  
  {search: "sankcii", id: "sanctions", title: "Санкции", data: ""},

  {search: "", id: "stop_list", title: "Стоп-листы", data: ""},

  {search: "fns", id: "fns", title: "ФНС", data: "", func: item => {
    try {
      if(!item) return ["Данные отсутствуют"]
      return item
    } catch (error) {
      console.log('Ошибка в преобразовании fns', item, error)
    }
  }},

  {search: "spiski", id: "spiski", title: "Найдено в списках", data: ""},

  {search: "IncludeInList", id: "spark_spiski", title: "Спарк. Списки", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.ListName)) {
        const sparkLists = item.ListName.map(item => `${item.Id} / ${item.content}`)
        return sparkLists
      } else {
        return `${item.ListName.Id} / ${item.ListName.content}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании spark_spiski', item, error)
    }
  }},

  {search: "", id: "befenicials", title: "Бенефициары", data: ""},
  {search: "founders_fl", id: "founders_fl", title: "Учредители / Физические лица", data: ""},
  {search: "founders_ul", id: "founders_ul", title: "Учредители / Юридичекие лица", data: ""},
  {search: "fl", id: "fl", title: "История / Физические лица", data: ""},
  {search: "ul", id: "ul", title: "История / Юридичекие лица", data: ""},
  {search: "heads_ul", id: "heads_ul", title: "Руководство / Юридичекие лица", data: ""},
  {search: "heads_fl", id: "heads_fl", title: "Руководство / Физические лица", data: ""},
  {search: "share_holders_fl", id: "share_holders_fl", title: "Акционеры / Физические лица", data: ""},
  {search: "share_holders_ul", id: "share_holders_ul", title: "Акционеры / Юридичекие лица", data: ""},


  {search: "PersonsWithoutWarrant", id: "heads", title: "Руководители", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.Person)) {
        const heads = []
        item.Person.map(elem =>  {
          const { INN, Position, FIO } = elem
          const first_name = parsingFio(FIO).FirstName
          const middle_name = parsingFio(FIO).MiddleName
          const last_name = parsingFio(FIO).SurName
          return heads.push({
            ActualDate: item.ActualDate,
            first_name, 
            middle_name, 
            last_name, 
            inn: INN || 'не найден', 
            position: Position ? Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase() : ""
          })
        })
        return heads
      } else {
        const { Person, ActualDate, Person: {Position} } = item
        const first_name = parsingFio(Person.FIO).FirstName
        const middle_name = parsingFio(Person.FIO).MiddleName
        const last_name = parsingFio(Person.FIO).SurName
        return [{
          first_name, 
          middle_name, 
          last_name, 
          ActualDate, 
          inn: Person.INN || 'не найден', 
          position: Position ? Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase() : ""
        }]
      }
    } catch (error) {
      console.log('Ошибка в преобразовании heads', item, error)
    }
  }},

  {search: "", id: "management_companies", title: "Управляющие кампании", data: ""},

  {search: "LeaderList", id: "leaders_list", title: "Состав руководителей", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.Leader)) {
        const heads = []
        item.Leader.map(elem =>  {
          const { ActualDate, FIO, INN, Position } = elem
          const first_name = FIO.split(' ')[1]
          const middle_name = FIO.split(' ')[2]
          const last_name = FIO.split(' ')[0]
          return heads.push({first_name, middle_name, last_name, ActualDate, inn: INN || 'не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()})
        })
        return heads
      } else {
        const { ActualDate, FIO, INN, Position } = item.Leader
        const first_name = FIO.split(' ')[1]
        const middle_name = FIO.split(' ')[2]
        const last_name = FIO.split(' ')[0]
        return [{first_name, middle_name, last_name, ActualDate, inn: INN || 'не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()}]
      }
    } catch (error) {
      console.log('Ошибка в преобразовании leaders_list', item, error)
    }
  }},

  {search: "Sex", id: "sex", title: "Пол", data: "", func: item => {
    if(!item.Name) return 'Данные отсутствуют'
    return item.Name
  }},

  {search: "BirthDate", id: "birthdate", title: "Дата рождения", data: ""},

  {search: "BirthPlace", id: "birth_place", title: "Место рождения", data: ""},
]

/** Поля для парсинга ИП */
export const fieldsArrIP = [
  {search: "FullNameRus", id: "full_name", title: "ФИО", data: ""},

  {search: "INN", id: "inn", title: "ИНН", data: ""},

  {search: "BirthDate", id: "birthdate", title: "Дата рождения", data: ""},

  {search: "BirthPlace", id: "birth_place", title: "Место рождения", data: ""},

  {search: "OGRNIP", id: "ogrn", title: "ОГРН", data: ""},

  {search: "CompanySizeStr", id: "company_type", title: "Тип компании", data: "", func: item =>  {
    if(!item) return 'Данные отсутствуют'
    else if (item === " / ") return ""
    else return `${item.Code} / ${item.Name}`
  }},

  {search: "DateReg", id: "registration_date", title: "Дата регистрации", data: "", func: (item = 'Данные отсутствуют') => item},

  {search: "Status", id: "status", title: "Статус", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    return `${item.GroupName} ${"/ " + getDate(item.Date)}`
  }},

  {search: "FederalTaxRegistrationCurrent", id: "address", title: "Юридический адрес", data: "", func: item => {
    if(!item.RegAuthorityAddress) return 'Данные отсутствуют'
    return item.RegAuthorityAddress
  }},

  {search: "OKVED2List", id: "okved", title: "Основной ОКВЭД", data: "",func: item => {
    if(!item) return 'Данные отсутствуют'
    else if(!item.OKVED.length) return ""
    if(Array.isArray(item.OKVED) && item.OKVED.length) {
      const okved = item.OKVED.filter(el =>  el.IsMain === 'true')
      const { Code, Name } = okved[0]
      return `${Code} / ${Name}`
    } else {
      return `${item.OKVED.Code} / ${item.OKVED.Name}`
    }
  }},

  {search: "Sex", id: "sex", title: "Пол", data: "", func: item => {
    if(!item.Name) return 'Данные отсутствуют'
    return item.Name
  }},

  {search: "", id: "heads", title: "Руководители", data: ""},

  {search: "arbitrazh", id: "arbiter", title: "Арбитраж", data: "", func: item => {
    try {
      if(!item) return ''
      const arbiter = {
        "istec":{
          "year": item.istec[0],
          "year3": item.istec[1]
        },
        "otvet":{
          "year": item.otvetchik[0],
          "year3": item.otvetchik[0]
        },
        "other": item.prochee ? item.prochee : ""
      }
      return arbiter
    } catch (error) {
      console.log('Ошибка в преобразовании arbiter', item, error)
    }
  }},

  {search: "", id: "arbiter_other", title: "Арбитраж прочее", data: ""},

  {search: "", id: "isponlit_proizvodstva", title: "Исполнительные производства", data: ""},
  
  {search: "", id: "fns", title: "ФНС", data: ""},

  {search: "spiski", id: "spiski", title: "Найдено в списках", data: ""},

  {search: "sankcii", id: "sanctions", title: "Санкции", data: ""},
]