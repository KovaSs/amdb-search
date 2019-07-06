import moment from 'moment'

export const fieldsArr = [
  {search: "ShortNameRus", id: "name", title: "Сокрашеное наименование", data: ""},

  {search: "FullNameRus", id: "full_name", title: "Полное наименование", data: ""},

  {search: "INN", id: "inn", title: "ИНН", data: ""},

  {search: "OGRN", id: "ogrn", title: "ОГРН", data: ""},

  {search: "CompanyType", id: "company_type", title: "Тип компании", data: "", func: item =>  {
    if(!item) return 'Данные отсутствуют'
    switch (item) {
      case "1":
        return 'Обычная компания'
      case "3":
        return 'Страховая компания'
      case "4":
        return 'Страховой брокер'
      case "5":
        return 'Банковская организация'
      default:
        return 'Данные отсутствуют'
    }
  }},

  {search: "DateFirstReg", id: "registration_date", title: "Дата регистрации", data: "", func: (item = 'Данные отсутствуют') => moment(item).format('DD.MM.YYYY')},

  {search: "Status", id: "status", title: "Статус", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    const status = []
    item.GroupName && status.push(item.GroupName)
    item.Type !== item.GroupName && status.push(item.Type)
    item.Date && status.push( moment(item.Date).format('DD.MM.YYYY'))
    return status.join(' / ')
  }},

  {search: "LegalAddresses", id: "address", title: "Юридический адресс", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    const { Address : {Address} } = item
    return Address
  }},

  {search: "PhoneList", id: "phone_list", title: "Список телефонов", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    const { Phone, Phone : {Code, Number} } = item
    if(Array.isArray(Phone)) {
      const newArrayPnoneList = Phone.map((item, key) => {
        const newItem = `(${item.Code})${item.Number}` 
        return newItem 
      })
      return newArrayPnoneList
    } else {
      return `(${Code})${Number}`
    }
  }},

  {search: "OKVED2List", id: "okved", title: "Основной ОКВЭД", data: "",func: item => {
    if(!item) return 'Данные отсутствуют'
    if(Array.isArray(item.OKVED)) {
      const okved = item.OKVED.filter(el =>  el.IsMain === 'true')
      const { Code, Name } = okved[0]
      return `${Code} / ${Name}`
    }
  }},

  {search: "WorkersRange", id: "workers_range", title: "Численность персонала", data: ""},

  {search: "StaffNumberFTS", id: "workers_range_fns", title: "Численность персонала по данным ФНС", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    const { Number: {ActualDate, content}} = item
    return `${content} / ${moment(ActualDate).format('DD.MM.YYYY')}`
  }},

  {search: "CharterCapital", id: "capital", title: "Уставной капитал", func: item => {
    if(!item) return 'Данные отсутствуют'
    // eslint-disable-next-line
    return item.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + '\u200A')
  }},

  {search: "IndexOfDueDiligence", id: "index_of_due_diligence", title: "Индекс должносной осмотрительности", data: "", func: item => {
    if(item.Index === 'N/A' || !item) return 'N/A - Данные отсутствуют'
    return `${item.Index} / ${item.IndexDesc}`
  }},

  {search: "PaymentIndex", id: "payment_index", title: "Индекс платежной дисциплины", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    return `${item.PaymentIndexValue} / ${item.PaymentIndexDesc}`
  }},

  {search: "FailureScore", id: "failure_score", title: "Индекс финансового риска", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    return `${item.FailureScoreValue} / ${item.FailureScoreDesc}`
  }},
  
  {search: "", id: "isponlit_proizvodstva", title: "Исполнительные производства", data: ""},
  
  {search: "", id: "sanctions", title: "Санкции", data: ""},

  {search: "", id: "fns", title: "ФНС", data: ""},

  {search: "", id: "arbiter", title: "Арбитраж", data: ""},

  {search: "Predecessor", id: "precessors", title: "Предшедственники", data: "", func: item => {
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
  }}, 

  {search: "Successor", id: "successors", title: "Приемники", data: "", func: item => {
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
  }},

  {search: "", id: "befenicials", title: "Бенефициары", data: ""},

  {search: "", id: "founders_fl", title: "Физические лица", data: ""},

  {search: "", id: "founders_ul", title: "Юридичекие лица", data: ""},

  {search: "PersonsWithoutWarrant", id: "heads", title: "Руководители", data: "", func: item => {
    if(!item) return ''
    if(Array.isArray(item.Person)) {
      const heads = []
      item.Person.map(el =>  {
        const { Person, ActualDate, Person: {Position} } = el
        const first_name = Person.FIO.split(' ')[1]
        const middle_name = Person.FIO.split(' ')[2]
        const last_name = Person.FIO.split(' ')[0]
        return heads.push({first_name, middle_name, last_name, ActualDate, inn: Person.INN || 'не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()})
      })
      return heads
    } else {
      const { Person, ActualDate, Person: {Position} } = item
      const first_name = Person.FIO.split(' ')[1]
      const middle_name = Person.FIO.split(' ')[2]
      const last_name = Person.FIO.split(' ')[0]
      return [{first_name, middle_name, last_name, ActualDate, inn: Person.INN || 'не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()}]
    }
  }},

  {search: "", id: "management_companies", title: "Управляющие кампании", data: ""},

  {search: "LeaderList", id: "leaders_list", title: "Состав руководителей", data: "", func: item => {
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
  }}
]

export const fieldsArrIP = [
  {search: "FullNameRus", id: "full_name", title: "ФИО", data: ""},

  {search: "INN", id: "inn", title: "ИНН", data: ""},

  {search: "OGRNIP", id: "ogrn", title: "ОГРН", data: ""},

  {search: "CompanyType", id: "company_type", title: "Тип компании", data: "", func: item =>  {
    if(!item) return 'Данные отсутствуют'
    return `${item.Code} / ${item.Name}`
  }},

  {search: "DateReg", id: "registration_date", title: "Дата регистрации", data: "", func: (item = 'Данные отсутствуют') => moment(item).format('DD.MM.YYYY')},

  {search: "Status", id: "status", title: "Статус", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    return `${item.GroupName} ${"/ " + moment(item.Date).format('DD.MM.YYYY')}`
  }},

  {search: "FederalTaxRegistrationCurrent", id: "address", title: "Юридический адресс", data: "", func: item => {
    if(!item.RegAuthorityAddress) return 'Данные отсутствуют'
    return item.RegAuthorityAddress
  }},

  {search: "OKVED2List", id: "okved", title: "Основной ОКВЭД", data: "",func: item => {
    if(!item) return 'Данные отсутствуют'
    if(Array.isArray(item.OKVED)) {
      const okved = item.OKVED.filter(el =>  el.IsMain === 'true')
      const { Code, Name } = okved[0]
      return `${Code} / ${Name}`
    } else {
      return `${item.OKVED.Code} / ${item.OKVED.Name}`
    }
  }},

  {search: "sex", id: "sex", title: "Пол", data: "", func: item => {
    if(!item.Name) return 'Данные отсутствуют'
    return item.Name
  }},

  {search: "PersonsWithoutWarrant", id: "heads", title: "Руководители", data: "", func: item => {
    if(!item) return ['']
      const { Person, ActualDate, Person: {Position} } = item
      const first_name = Person.FIO.split(' ')[1]
      const middle_name = Person.FIO.split(' ')[2]
      const last_name = Person.FIO.split(' ')[0]
      return [{first_name, middle_name, last_name, ActualDate, inn: Person.INN || 'не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()}]
  }},

  {search: "", id: "isponlit_proizvodstva", title: "Исполнительные производства", data: ""},
  
  {search: "", id: "sanctions", title: "Санкции", data: ""},

  {search: "", id: "fns", title: "ФНС", data: ""},

  {search: "", id: "arbiter", title: "Арбитраж", data: ""}
]