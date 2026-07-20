const pad = (n: number): string => String(n).padStart(2, '0')

const randomDate = (startYear: number, endYear: number): string => {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear + 1))
  const month = pad(Math.floor(Math.random() * 12) + 1)
  const day = pad(Math.floor(Math.random() * 28) + 1)
  return `${day}.${month}.${year}`
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const surnames = ['ИВАНОВ', 'ПЕТРОВ', 'СИДОРОВ', 'СМИРНОВ', 'КУЗНЕЦОВ', 'ПОПОВ', 'ВАСИЛЬЕВ', 'КОЗЛОВ', 'МОРОЗОВ', 'НОВИКОВ', 'ФЕДОРОВ', 'МИХАЙЛОВ']
const firstnames = ['ИВАН', 'ПЕТР', 'СЕРГЕЙ', 'АЛЕКСАНДР', 'МИХАИЛ', 'АНДРЕЙ', 'ДМИТРИЙ', 'ВЛАДИМИР', 'АЛЕКСЕЙ', 'НИКОЛАЙ']
const middlenames = ['ИВАНОВИЧ', 'ПЕТРОВИЧ', 'СЕРГЕЕВИЧ', 'АЛЕКСАНДРОВИЧ', 'МИХАЙЛОВИЧ', 'АНДРЕЕВИЧ', 'ДМИТРИЕВИЧ', 'ВЛАДИМИРОВИЧ']

const ulNames = [
  'ООО "СТРОЙИНВЕСТ"',
  'ООО "ТЕХНОПРОМ"',
  'ООО "РЕГИОНТОРГ"',
  'ООО "СПЕЦМОНТАЖ"',
  'ООО "ПРОМСТРОЙ"',
  'ЗАО "СВЯЗЬТЕЛЕКОМ"',
  'ООО "ТОРГМАРКЕТ"',
  'ООО "ЛОГИСТИКА"',
]

const baseNamesFl = [
  { namebase: 'Стоп-листы ЦБ РФ', nametable: 'Перечень физ.лиц', report_name: 'ЦБ-ФЛ' },
  { namebase: 'Росфинмониторинг', nametable: 'Реестр ФЛ', report_name: 'РФМ-ФЛ' },
  { namebase: 'ФССП России', nametable: 'Должники ФЛ', report_name: 'ФССП-ФЛ' },
  { namebase: 'МВД России', nametable: 'Разыскиваемые', report_name: 'МВД-ФЛ' },
]

const baseNamesUl = [
  { namebase: 'Стоп-листы ЦБ РФ', nametable: 'Перечень ЮЛ', report_name: 'ЦБ-ЮЛ' },
  { namebase: 'Росфинмониторинг', nametable: 'Реестр ЮЛ', report_name: 'РФМ-ЮЛ' },
  { namebase: 'ФНС России', nametable: 'Недействительные ЮЛ', report_name: 'ФНС-ЮЛ' },
  { namebase: 'Минюст России', nametable: 'Некоммерческие организации', report_name: 'МИНЮСТ-ЮЛ' },
]

const generateRandomInn = (isUl: boolean): string => {
  const digits = Array.from({ length: isUl ? 10 : 12 }, () => Math.floor(Math.random() * 10)).join('')
  return digits
}

const generateRandomOgrn = (): string => {
  return Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('')
}

const generateRandomPassport = (): string => {
  const series = pad(Math.floor(Math.random() * 99) + 10)
  const number = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
  return `${series} ${number}`
}

const generateRowFl = () => {
  const surname = pick(surnames)
  const firstname = pick(firstnames)
  const middlename = pick(middlenames)
  return {
    fio: `${surname} ${firstname} ${middlename}`,
    fullname: `${surname} ${firstname} ${middlename}`,
    birthdate: randomDate(1960, 1995),
    passport: generateRandomPassport(),
    inn: generateRandomInn(false),
    ogrn: '',
    inclusion_date: randomDate(2018, 2024),
    is_actual: pick(['Да', 'Нет']),
    rowid: String(Math.floor(Math.random() * 100000)),
    columnname: pick(['Актуальная запись', 'Архивная запись']),
  }
}

const generateRowUl = () => {
  const name = pick(ulNames)
  return {
    fio: name,
    fullname: name,
    birthdate: '',
    passport: '',
    inn: generateRandomInn(true),
    ogrn: generateRandomOgrn(),
    inclusion_date: randomDate(2018, 2024),
    is_actual: pick(['Да', 'Нет']),
    rowid: String(Math.floor(Math.random() * 100000)),
    columnname: pick(['Актуальная запись', 'Архивная запись']),
  }
}

const generateBases = (count: number, isUl: boolean) => {
  const baseNames = isUl ? baseNamesUl : baseNamesFl
  return baseNames.slice(0, Math.min(count, baseNames.length)).map((base, i) => ({
    ID_base: String(i + 1),
    ID_table: String((i + 1) * 100),
    namebase: base.namebase,
    nametable: base.nametable,
    report_name: base.report_name,
    rows: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
      isUl ? generateRowUl() : generateRowFl()
    ),
  }))
}

export const generateStopListResponse = (type: string): { Response: any[]; Status: string } => {
  const isUl = type === 'ul'
  return {
    Status: 'OK',
    Response: generateBases(isUl ? 2 : 3, isUl),
  }
}
