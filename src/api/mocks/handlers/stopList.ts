import { http, HttpResponse } from 'msw'
import { sleep } from '../utils'
import { DEFAULT_DELAY } from '../config'
import { generateStopListResponse } from '../generators/stopListData'

const WHITE_SEARCH_2 = '/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl'
const BLACK_SEARCH_2 = '/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl'
const WHITE_SEARCH_ALL = '/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search_all.pl'
const BLACK_SEARCH_ALL = '/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_all.pl'

export const stopListHandlers = [
  http.post(WHITE_SEARCH_2, async ({ request }) => {
    const body: any = await request.json()
    await sleep(DEFAULT_DELAY)
    return HttpResponse.json(generateStopListResponse(body.type || 'fl'))
  }),

  http.post(BLACK_SEARCH_2, async ({ request }) => {
    const body: any = await request.json()
    await sleep(DEFAULT_DELAY)
    return HttpResponse.json(generateStopListResponse(body.type || 'fl'))
  }),

  http.post(WHITE_SEARCH_ALL, async ({ request }) => {
    const body: any = await request.json()
    await sleep(DEFAULT_DELAY)
    return HttpResponse.json(generateStopListResponse(body.type || 'fl'))
  }),

  http.post(BLACK_SEARCH_ALL, async ({ request }) => {
    const body: any = await request.json()
    await sleep(DEFAULT_DELAY)
    return HttpResponse.json(generateStopListResponse(body.type || 'fl'))
  }),
]
