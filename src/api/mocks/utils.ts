export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const buildCompanyInfo = () => ({
  FullNameRus: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "АЛЬПИКО ГРУПП"',
  ShortNameRus: 'ООО "АЛЬПИКО ГРУПП"',
  INN: '7733782496',
  OGRN: '1117746866049',
  type: 'Юридическое лицо',
  Status: {
    Code: 0,
    Date: '2012-10-29',
    GroupName: 'Действующее'
  },
  OKVED2List: {
    OKVED: [
      { IsMain: 'true', Code: '41.20', Name: 'Строительство жилых и нежилых зданий' },
      { IsMain: 'false', Code: '43.12', Name: 'Подготовка строительной площадки' }
    ]
  },
  LegalAddresses: {
    Address: [
      {
        ActualDate: '2012-10-29',
        Address: '119017, г. Москва, ул. Б. Ордынка, д. 40, стр. 4'
      }
    ]
  },
  PhoneList: [
    { Phone: '+7 (495) 123-45-67', Type: 'раб' }
  ],
  Email: 'info@alpico.ru',
  Www: 'www.alpico.ru',
  DateFirstReg: '2012-10-29',
  WorkersRange: '50-100',
  StaffNumberFTS: {
    Number: [
      { ActualDate: '2024-01-01', content: '87' }
    ]
  },
  CharterCapital: '1000000',
  IndexOfDueDiligenceStr: 'Высокий',
  PaymentIndexStr: 'Средний',
  FailureScoreStr: 'Низкий',
  PersonsWithoutWarrant: '',
  ps: {},
  LeaderList: {
    Leader: [
      {
        FIO: 'Иванов Иван Иванович',
        INN: '773312345678',
        Position: 'Генеральный директор',
        ActualDate: '2012-10-29'
      }
    ]
  },
  CompanySizeStr: 'Среднее предприятие',
  IncludeInList: '',
  fns: '7701 / ИФНС России № 1 по г. Москве',
  spiski: [],
  sankcii: [],
  ispolnitelnye_proizvodstva: [],
  LinkedOGRNIP: '',
  head_qty: 1,
  arbitrazh: {
    istec: [
      '0 руб. (0)',
      '0 руб. (0)'
    ],
    otvetchik: [
      '0 руб. (0)',
      '0 руб. (0)'
    ],
    prochee: []
  },
  indeks: '',
  rieltors: '',
  history_identify: []
})

export const buildIpCompanyInfo = () => ({
  FullNameRus: 'Иванов Иван Иванович',
  INN: '770112345678',
  OGRNIP: '312774635400012',
  type: 'Индивидуальный предприниматель',
  DateReg: '2012-12-20',
  Status: {
    Code: 0,
    Date: '2012-12-20',
    GroupName: 'Действующее'
  },
  BirthDate: '1980-05-15',
  BirthPlace: 'г. Москва',
  Sex: { Name: 'Мужской' },
  OKVED2List: {
    OKVED: [
      { IsMain: 'true', Code: '62.01', Name: 'Разработка компьютерного программного обеспечения' }
    ]
  },
  PhoneList: [
    { Phone: '+7 (495) 999-99-99', Type: 'моб' }
  ],
  Email: 'ivanov@example.com',
  arbitrazh: {
    istec: [],
    otvetchik: [],
    prochee: []
  },
  spiski: [],
  sankcii: [],
  history_identify: []
})
