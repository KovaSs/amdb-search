import { http, HttpResponse } from 'msw'
import { sleep } from '../utils'
import { buildCompanyInfo, buildIpCompanyInfo } from '../utils'
import { DEFAULT_DELAY } from '../config'

const CGI_OTKRYTIE = '/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta.pl'

export const openBillHandlers = [
  http.post(CGI_OTKRYTIE, async ({ request }) => {
    const body: any = await request.json()
    const { type, reqnum = '123456', data = {} } = body

    await sleep(DEFAULT_DELAY)

    switch (type) {
      case 'get_company_info': {
        const inn = data?.code || ''
        const isIp = inn?.length === 12
        const companyInfo = isIp ? buildIpCompanyInfo() : buildCompanyInfo()
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            company_info: companyInfo,
            ip: isIp,
            history_identify: []
          }
        })
      }

      case 'get_affilates': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            founders_fl: [],
            founders_ul: [],
            ul: [],
            fl: [],
            heads_ul: [],
            heads_fl: [],
            share_holders_fl: [],
            share_holders_ul: [],
            egr: []
          }
        })
      }

      case 'identify_user': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            INN: data.INN || data.INNIP || '',
            SurName: data.SurName || '',
            FirstName: data.FirstName || '',
            MiddleName: data.MiddleName || '',
            Seria: data.Seria || '',
            Number: data.Number || '',
            DateOfBirth: data.DateOfBirth || '',
            Address: data.Address || '',
            html: `<div style="padding:20px">
              <h3>Результат идентификации</h3>
              <p><b>ФИО:</b> ${data.SurName || ''} ${data.FirstName || ''} ${data.MiddleName || ''}</p>
              <p><b>ИНН:</b> ${data.INN || data.INNIP || data.OGRN || '—'}</p>
              <p><b>Дата рождения:</b> ${data.DateOfBirth || '—'}</p>
              <p><b>Паспорт:</b> ${data.Seria || ''} ${data.Number || ''}</p>
              <p><b>Адрес:</b> ${data.Address || '—'}</p>
            </div>`
          }
        })
      }

      case 'request_user': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            html: `<div style="padding:20px">
              <h3>Полная проверка (Croinform)</h3>
              <p><b>ФИО:</b> ${data.SurName || ''} ${data.FirstName || ''} ${data.MiddleName || ''}</p>
              <p><b>ИНН:</b> ${data.INNExp || '—'}</p>
              <p><b>Дата рождения:</b> ${data.DateOfBirth || '—'}</p>
              <p><b>Паспорт:</b> ${data.Seria || ''} ${data.Number || ''}</p>
              <p><b>Регион:</b> ${data.RegionExp || ''} ${data.CityExp || ''} ${data.StreetExp || ''}</p>
              <hr/>
              <p><i>Проверка выполнена. Подробная информация отсутствует в мок-режиме.</i></p>
            </div>`,
            lists: [],
            parse_ci_request: { vektor_fl: [] }
          }
        })
      }

      case 'fssp': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            html: `<table style="width:100%;font-size:9pt">
              <tr><th>Отдел ФССП</th><th>Исполнительное производство</th><th>Сумма</th><th>Статус</th></tr>
              <tr><td colspan="4" style="text-align:center;padding:10px">Данные ФССП отсутствуют</td></tr>
            </table>`
          }
        })
      }

      case 'stoplist': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: []
        })
      }

      case 'digest':
      case 'digest_fl_search': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            digest: [],
            history: [],
            risks: []
          }
        })
      }

      case 'digest_fl_write':
      case 'digest_fl_edit':
      case 'digest_fl_delete': {
        return HttpResponse.json({
          status: { success: true },
          reqnum,
          data: {
            digest: [],
            history: [],
            risks: []
          }
        })
      }

      default:
        return HttpResponse.json(
          { status: { success: false, error: `Unknown type: ${type}` } },
          { status: 400 }
        )
    }
  })
]
