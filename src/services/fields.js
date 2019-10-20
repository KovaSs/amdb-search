import { getDate, parsingFio, sumTrans, getShortCompName, updateArbiter } from './utils'

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
      console.log('Ошибка в преобразовании status', item)
    }
  }},

  {search: "OKVED2List", id: "okved", title: "Основной ОКВЭД", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.OKVED)) {
        const okved = item.OKVED.filter(el =>  el.IsMain === 'true')
        const { Code, Name } = okved[0]
        return `${Code} / ${Name}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании okved', item, error)
    }
  }},

  {search: "ChangesInNameAndLegalForm", id: "previous_name", title: "Изменения в наименовании и организационно-правовой форме", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item.Change)) {
        return item.Change.map(prevName =>  {
          return `${getDate(prevName.ChangeDate)} / ${prevName.INN ? `${prevName.INN} /` : ""} ${getShortCompName(prevName.Name)}`
        })
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
      console.log('Ошибка в преобразовании company_size', item)
    }
  }},

  {search: "LegalAddresses", id: "address", title: "Юридический адрес", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      const { Address } = item
      if(Array.isArray(item.Address)) return Address[0].Address
      else return Address.Address
    } catch {
      console.log('Ошибка в преобразовании address', item)
    }
  }},

  {search: "PreviousAddress", id: "previous_address", title: "Предыдущие адреса", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      const { Address } = item
      if(Array.isArray(Address)) {
        const addressArr = Address.map(address => `${getDate(address.ActualDate)} / ${address.Address}`)
        return addressArr
      }
      else return Address.Address
    } catch (error) {
      console.log('Ошибка в преобразовании previous_address', item, error)
    }
  }},

  {search: "WorkersRange", id: "workers_range", title: "Численность персонала", data: ""},

  {search: "StaffNumberFTS", id: "workers_range_fns", title: "Численность персонала по данным ФНС", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      if(Array.isArray(item.Number)) {
        const workersArr = item.Number.map(workers => `${getDate(workers.ActualDate)} / ${workers.content}`)
        return workersArr
      } else {
        const { Number: {ActualDate, content}} = item
        return `${content} / ${getDate(ActualDate)}`
      }
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
        return item.map(el => `${el.Name} / ${el.INN} ${el.Status && el.Status.Text ? `/ ${el.Status.Text}` : ''}`)
      } else {
        const { INN, Name, Status } = item
        return `${Name} / ${INN} ${Status && Status.Text ? `/ ${Status.Text}` : '/ Нет данных о статусе'}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании precessors', item, error)
    }
  }}, 

  {search: "Successor", id: "successors", title: "Преемники", data: "", func: item => {
    try {
      if(!item) return ''
      if(Array.isArray(item)) {
        return item.map(element => `${element.Name} / ${element.INN} ${element.Status.Text ? `/ ${element.Status.Text}` : ''}`)
      } else {
        const { INN, Name, Status } = item
        return `${Name} / ${INN} ${Status.Text ? `/ ${Status.Text}` : ''}`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании successors', item, error)
    }
  }},

  {search: "PhoneList", id: "phone_list", title: "Список телефонов", data: "", func: item => {
    try {
      if(!item) return 'Данные отсутствуют'
      return item.Phone
    } catch (error) {
      console.log('Ошибка в преобразовании phone_list', item, error)
    }
  }},

  {search: "Email", id: "email", title: "E-mail", data: ""},

  {search: "Www", id: "site", title: "Сайт", data: ""},

  {search: "arbitrazh", id: "arbiter", title: "Арбитраж", data: "", func: item => {
    try {
      if(!item) return ''
      const arbiter = {
        "istec":{
          "year": updateArbiter(item.istec[0]),
          "year3": updateArbiter(item.istec[1])
        },
        "otvet":{
          "year": updateArbiter(item.otvetchik[0]),
          "year3": updateArbiter(item.otvetchik[1])
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
            inn: INN || 'Не найден', 
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
          inn: Person.INN || 'Не найден', 
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
          return heads.push({first_name, middle_name, last_name, ActualDate, inn: INN || 'Не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()})
        })
        return heads
      } else {
        const { ActualDate, FIO, INN, Position } = item.Leader
        const first_name = FIO.split(' ')[1]
        const middle_name = FIO.split(' ')[2]
        const last_name = FIO.split(' ')[0]
        return [{first_name, middle_name, last_name, ActualDate, inn: INN || 'Не найден', position: Position.charAt(0).toUpperCase()+Position.substr(1).toLowerCase()}]
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

  {search: "type", id: "company_type", title: "Тип компании", data: "", func: item =>  {
    if(!item) return 'Данные отсутствуют'
    else return item
  }},

  {search: "DateReg", id: "registration_date", title: "Дата регистрации", data: "", func: (item = 'Данные отсутствуют') => item},

  {search: "Status", id: "status", title: "Статус", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    return `${item.GroupName} ${"/ " + getDate(item.Date)}`
  }},

  {search: "OKATO", id: "address", title: "Юридический адрес", data: "", func: item => {
    if(!item) return 'Данные отсутствуют'
    else if (item.RegionName) return item.RegionName
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

  {search: "LinkedOGRNIP", id: "previous_name", title: "Изменения в наименовании и организационно-правовой форме", data: "", func: item => {
    try {
      if(!item) return ''
      else if( Array.isArray(item.OGRNIP)) {
        return item.OGRNIP.map(item => {
          const {IsActing, content } = item
          return `${content} / ${ IsActing === "true" ? "Действующее" : "Не действующее" }`
        })
      }
      else if( item.OGRNIP) {
        const {OGRNIP : { IsActing, content }} = item
        return `${content} / ${ IsActing === "true" ? "Действующее" : "Не действующее" }`
      }
    } catch (error) {
      console.log('Ошибка в преобразовании okved', item, error)
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
          "year": updateArbiter(item.istec[0]),
          "year3": updateArbiter(item.istec[1])
        },
        "otvet":{
          "year": updateArbiter(item.otvetchik[0]),
          "year3": updateArbiter(item.otvetchik[1])
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


export const jsonUl = {
  /** Анкета клиента */
  "blank": {
    propertyType:{ title: "Тип собственности", data: "" },
    objectivesOfActivity: {title: "Цели финансово-хозяйственной деятельности", data: ""},
    companyWageFund: {title: "Среднемесячный фонд оплаты труда (ФОТ) компании (согласно формы отчетности РСВ-1 ПФР на момент представления сведений)", data: ""},
    finPosition: {title: "Оценка финансового положения", data: ""},
    organizationType: {title: "Штатная численность Вашей организации", data: ""},
    sourcesFunds: {title: "Тип организации (согласно типа собственности)", data: ""},
    otherSourcesFunds: {title: "Сведения об источниках происхождения денежных средств и (или) иного имущества", data: ""},
    subjectCmb: {title: "Является ли компания субъектом МСП", data: ""},
    branches: {title: "Имеются ли у компании филиалы (представительства)", data: ""},
    holding: {title: "Является ли организация частью холдинга", data: ""},
    teamWork: {title: "Участие в других организациях или совместная деятельность с другими", data: ""},
    finPositionDebts: {title: "Имеется ли существенная по суммам и (или) срокам текущая картотека неоплаченных расчетных документов к банковским счетам Клиента", data: ""},
    finPositionLosses: {title: "Имеются ли скрытые потери (например, неликвидные запасы готовой продукции и (или) требования, безнадежные к взысканию) в размере, равном или превышающем 25 процентов чистых активов Клиента?", data: ""},
    finPositionViolationTerms: {title: "Имеются ли случаи неисполнения или два и более случаев исполнения Клиентом обязательств по иным договорам с финансирующей организацией с нарушением сроков, предусмотренных договорами, общей продолжительностью от 5 до 30 календарных дней или единичный случай исполнения с нарушением сроков продолжительностью более чем на 30 календарных дней за последние 180 календарных дней либо прекращение Клиентом обязательств по иным договорам с финансирующей организацией предоставлением взамен исполнения обязательства отступного в форме имущества, которое не реализовано финансирующей организацией в течение 180 календарных дней или более, а также при условии, что совокупная величина указанных обязательств превышает 100 000 рублей", data: ""},
    finPositionUnprofitable: {title: "Имеется ли не предусмотренная планом развития Принципала (бизнес-планом), согласованным с Банком, убыточная деятельность Принципала, приведшая к существенному (25 процентов и более) снижению его чистых активов по сравнению с их максимально достигнутым уровнем в течение последних двенадцати месяцев, а для юридических лиц - Принципалов, с даты регистрации которых прошло менее одного года, - по сравнению с их максимально достигнутым уровнем за период деятельности такого юридического лица", data: ""},
    finPositionZeroValues: {title: "Имеются ли факты представления Клиентом в налоговые органы формы № 1 «Бухгалтерский баланс», с нулевыми значениями по разделам баланса «Оборотные активы» и «Краткосрочные обязательства» при условии существенных оборотов денежных средств по банковским счетам Клиента, открытым в финансирующей организации, за последние 180 календарных дней", data: ""},
    address: {title: "Местонахождение(филиала)", data: ""},
    staff: {title: "Штатная численность сотрудников(филиала)", data: ""},
    openDate: {title: "Дата открытия(филиала)", data: ""},
    companyName: {title: "Наименование компании (совместная деятельность)", data: ""},
    kindOfActivity: {title: "Вид деятельности (совместная деятельность)", data: ""},
    share: {title: "Доля участия (%) (совместная деятельность)", data: ""},
    holdingName: {title: "Наименование холдинга", data: ""},
    otherObjectives: {title: "Иная цель финансово-хозяйственной деятельности", data: ""},
    amount: {title: "Планируемые суммы операций по счетам в банках в среднем за месяц", data: ""},
    number: {title: "Планируемое количество операций по счетам в банках в среднем за месяц", data: ""},
    cashNumber: {title: "Планируемое количество операций по снятию денежных средств в наличной форме в среднем за месяц", data: ""},
    cashAmount: {title: "Планируемые суммы операций по снятию денежных средств в наличной форме в среднем за месяц", data: ""},
    transferNumber: {title: "Планируемое количество операций, связанных с переводами денежных средств, в рамках внешнеторговой деятельности в среднем за месяц", data: ""},
    transferAmount: {title: "Планируемые суммы операций, связанных с переводами денежных средств, в рамках внешнеторговой деятельности в среднем за месяц", data: ""},
    contractType: {title: "Виды договоров, расчеты по которым планируется осуществлять через Банк", data: ""},
    otherContract: {title: "Иной вид договора, расчет по которому планируется осуществлять через Банк", data: ""},
    debtsHistory: {title: "Кредитная история", data: ""},
    actualDebts: {title: "Действующие кредитные обязательства", data: ""},
    bankName: {title: "Наименование банка по действующему кредитному обязательству", data: ""},
    contractAmount: {title: "Сумма по договору, руб. по действующему кредитному обязательству", data: ""},
    outstanding: {title: "Остаток задолженности, руб. по действующему кредитному обязательству", data: ""},
    maturityDate: {title: "Дата погашения по действующему кредитному обязательству", data: ""},
    delay: {title: "Наличие просрочки по действующему кредитному обязательству", data: ""},
    actualContracts: {title: "Сведения о действующих договорах, в которых организация является залогодателем/поручителем", data: ""},
    contractCreditorName: {title: "Кредитор по действующему договору", data: ""},
    contractContractAmount: {title: "Сумма контракта по действующему договору", data: ""},
    contractOutstanding: {title: "Остаток задолженности, руб. по действующему договору", data: ""},
    contractMaturityDate: {title: "Дата погашения по действующему договору", data: ""},
    contractDelay: {title: "Наличие просрочки по действующему договору", data: ""},
    debtsStaff: {title: "Имеется ли задолженность перед персоналом организации (руб.)", data: ""},
    staffActual: {title: "Текущая задолженность перед персоналом", data: ""},
    staffOverdue: {title: "Просроченная задолженность перед персоналом", data: ""},
    staffTotal: {title: "Итого задолженность перед персоналом", data: ""},
    debtsNalog: {title: "Имеется ли задолженность по налогам и сборам (руб.)", data: ""},
    nalogActual: {title: "Текущая задолженность по налогам и сборам", data: ""},
    nalogOverdue: {title: "Просроченная задолженность по налогам и сборам", data: ""},
    nalogTotal: {title: "Итого задолженность по налогам и сборам", data: ""},
    reputationBankruptcy: {title: "Наличие процедур банкротства за последние 5 лет", data: ""},
    reputationInsolvency: {title: "Сведения о производстве по делу о несостоятельности (банкротстве)", data: ""},
    reputationCourtDecisions: {title: "Сведения о вступивших в силу решениях суда о признании несостоятельным (банкротом)", data: ""},
    reputationLiquidation: {title: "Сведения о проведении процедур ликвидации", data: ""},
    reputationFactsFailure: {title: "Наличие фактов неисполнения или ненадлежащего исполнения обязательств", data: ""},
    reputationFactsEmptyCash: {title: "Сведения о фактах неисполнения денежных обязательств по причине отсутствия денежных средств на банковских счетах", data: ""},
    reputationCourtCases: {title: "Наличие судебных дел, по которым организация выступает ответчиком", data: ""},
    managementOtherGovernmentName: {title: "Наименование органа управления в соответствии с уставом", data: ""},
    managementOtherGovernment: {title: "Дополнительный орган управления(совет директоров,наблюдательный совет и т.д.)", data: ""},
    managementOtherExecutiveAgency: {title: "Иной исполнительный орган", data: ""},
    managementOtherGovernmentFounders: {title: "Персональный состав (ФИО или наименование)", data: ""},
    managementExecutiveAgency: {title: "Исполнительный орган", data: ""},
    managementSupremeManagementBody: {title: "Высший орган управления", data: ""},
  },
  /** Сведения о актуальном банковском реквизите */
  "bankRequisites": {
    checkAccount: {title: "Расчетный счет"},
    bankName: {title: "Название банка"},
    bankBic: {title: "БИК банка"},
    corrAccount: {title: "Корреспонденский счет"},
    bankSwift: {title: "Swift"},
    bankRegNum: {title: "Банквоский регистрационный номер на сайте центрального банка РФ"},
  },
  /** Сведения о лицензии */
  "licenses": {
    kindOfActivity: {title: "Вид деятельности"},
    number: {title: "Номер лицензии"},
    date: {title: "Дата выдачи"},
    issuer: {title: "Кем выдана"},
    licensedActivities: {title: "Перечень видов лицензируемой деятельности"},
  },
  /** Заявка */
  "order": {
    id: {title: "Номер заявки"},
    amount: {title: "Сумма банковской гарантии"},
    bgType: {title: "Тип банковской гарантии"},
    bgSubtype: {title: ""},
    comment: {title: "Комментарий к заявке"},
    dateFrom: {title: "Срок Банковской Гарантии c"},
    dateTimeCreate: {title: "Дата создания заявки"},
    dateTo: {title: "Срок Банковской Гарантии до"},
    falling: {title: "В ходе аукциона было падение более, чем на 25% от НМЦ"},
    prepay: {title: "Наличие аванса по гос. контракту"},
    deadline: {title: "Крайний срок выдачи БГ"},
    finalPrice: {title: "finalPrice"},
    commission: {title: "commission"},
    orderTime: {title: "orderTime"},
    amountSendOfferOrders: {title: "amountSendOfferOrders"},
    amountExecutingOrders: {title: "amountExecutingOrders"},
    amountExecutedOrders: {title: "amountExecutedOrders"},
    },
  /** Закупка */
  "purchase": {
    notificationId: {title: "Серия"},
    purchaseNumber: {title: "Идентификатор тендера"},
    purchaseObjectInfo: {title: "Предмет тендера"},
    publishDate: {title: "Дата публикации"},
    customer: {title: "Заказчик"},
    customerInn: {title: "ИНН заказчика"},
    customerOgrn: {title: "ОГРН заказчика"},
    customerKpp: {title: "КПП заказчика"},
    customerPostAddress: {title: "Юридический адрес заказчика"},
    customerActualAddress: {title: "Фактический адрес заказчика"},
    customerRegNum: {title: "Регистрационный номер заказчика"},
    customerRegDate: {title: "Дата регистрации заказчика"},
    customerRegOrg: {title: "Наименование регистрирующего органа заказчика"},
    currencyCode: {title: "Код валюты"},
    currencyName: {title: "Название валюты"},
    maxPrice: {title: "Макс. цена контракта"},
    amount: {title: "Сумма"},
    collectingEndDatetime: {title: "Дата окончания подачи заявок"},
    type: {title: "Тип закупки"},
    amountRur: {title: "amountRur"},
    placingCode: {title: "placingCode"},
    okpds: {title: "okpds"},
  },
}