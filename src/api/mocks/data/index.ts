import alpico from '../../../components/ContentContainer/ElectronicBankGarantees/mock/json/alpico.json'
import avantel from '../../../components/ContentContainer/ElectronicBankGarantees/mock/json/avantel.json'
import ceventus from '../../../components/ContentContainer/ElectronicBankGarantees/mock/json/ceventus.json'
import requestIp from '../../../components/ContentContainer/ElectronicBankGarantees/mock/json/request_ip.json'
import { ul } from '../../../components/ContentContainer/ElectronicBankGarantees/mock/json/request_ul.js'

export const ebgMocks = {
  alpico,
  avantel,
  ceventus,
  requestIp,
  requestUl: ul
}

const pad = (n: number): string => String(n).padStart(2, '0')

const fmtDate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

const now = (offsetMin = 0): string => fmtDate(new Date(Date.now() - offsetMin * 60000))

export const ebgQueueData = [
  {
    id: 1,
    inn: '7733782496',
    name: 'ООО "АЛЬПИКО ГРУПП"',
    ogrn: '1117746866049',
    birthday: '',
    data: now(),
    status: '0',
    user: '',
    client_type: 'COMPANY',
    owner: '',
    owner_detail: ''
  },
  {
    id: 2,
    inn: '7729745328',
    name: 'ООО "ЦЕВЕНТУС"',
    ogrn: '1137746892518',
    birthday: '',
    data: now(),
    status: '0',
    user: '',
    client_type: 'COMPANY',
    owner: '',
    owner_detail: ''
  },
  {
    id: 3,
    inn: '7730123456',
    name: 'ООО "АВАНТЕЛ"',
    ogrn: '1027700123456',
    birthday: '',
    data: now(5),
    status: '1',
    user: 'Менеджер Иванов',
    client_type: 'COMPANY',
    owner: '',
    owner_detail: ''
  },
  {
    id: 4,
    inn: '770112345678',
    name: 'ИП Иванов Иван Иванович',
    ogrn: '312774635400012',
    birthday: '15.05.1980',
    data: now(),
    status: '0',
    user: '',
    client_type: 'SELF_EMPLOYED',
    owner: '',
    owner_detail: ''
  }
]
