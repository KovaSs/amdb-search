import { http, HttpResponse } from 'msw'
import { sleep } from '../utils'
import { DEFAULT_DELAY } from '../config'
import { ebgMocks, ebgQueueData } from '../data'

const statusStore: Map<string, { status: string; user: string }> = new Map()

const CGI_QUEUES = '/cgi-bin/serg/0/6/9/reports/276/ebg_get_queues.pl'
const CGI_CHANGE_STATUS = '/cgi-bin/serg/0/6/9/reports/276/ebg_change_status.pl'
const CGI_QUEUE_DETAIL = '/cgi-bin/serg/0/6/9/reports/276/ebg_queue_detail.pl'

export const ebgHandlers = [
  http.post(CGI_QUEUES, async () => {
    await sleep(DEFAULT_DELAY)
    const data = ebgQueueData.map(item => {
      const overrides = statusStore.get(item.inn)
      return overrides ? { ...item, ...overrides } : item
    })
    return HttpResponse.json({ data })
  }),

  http.post(CGI_CHANGE_STATUS, async ({ request }) => {
    const body: any = await request.json()
    const { inn, action } = body

    await sleep(DEFAULT_DELAY)

    if (!inn || !action) {
      return HttpResponse.json(
        { status: { success: false, error: 'Missing inn or action' } },
        { status: 400 }
      )
    }

    switch (action) {
      case 'take_to_work':
        statusStore.set(inn, { status: '1', user: 'mock_user' })
        return HttpResponse.json({ status: { success: true } })
      case 'return_queue':
        statusStore.set(inn, { status: '0', user: '' })
        return HttpResponse.json({ status: { success: true } })
      case 'accept':
        statusStore.set(inn, { status: '2', user: 'mock_user' })
        return HttpResponse.json({ status: { success: true } })
      default:
        return HttpResponse.json(
          { status: { success: false, error: `Unknown action: ${action}` } },
          { status: 400 }
        )
    }
  }),

  http.post(CGI_QUEUE_DETAIL, async ({ request }) => {
    const body: any = await request.json()
    const { inn } = body

    await sleep(DEFAULT_DELAY)

    const ebgJson = inn === '7733782496' ? ebgMocks.alpico
      : inn === '7729745328' ? ebgMocks.ceventus
      : inn === '7730123456' ? ebgMocks.avantel
      : inn?.length === 12 ? ebgMocks.requestIp
      : ebgMocks.requestUl

    return HttpResponse.json({ data: ebgJson })
  })
]
