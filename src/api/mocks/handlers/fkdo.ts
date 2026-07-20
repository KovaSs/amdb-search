import { http, HttpResponse } from 'msw'
import { sleep } from '../utils'
import { DEFAULT_DELAY } from '../config'

const CGI_FKDO = '/cgi-bin/serg/0/6/9/reports/276/otkrytie_scheta_fkdo.pl'

export const fkdoHandlers = [
  http.post(CGI_FKDO, async ({ request }) => {
    const body: any = await request.json()
    const { type } = body

    await sleep(DEFAULT_DELAY)

    switch (type) {
      case 'get_fkdo_info':
        return HttpResponse.json({ data: [] })

      case 'fkdo_load_file':
        return HttpResponse.arrayBuffer(
          new ArrayBuffer(0),
          {
            headers: {
              'Content-Type': 'application/pdf; charset=binary'
            }
          }
        )

      default:
        return HttpResponse.json(
          { status: { success: false, error: `Unknown FKDO type: ${type}` } },
          { status: 400 }
        )
    }
  })
]
