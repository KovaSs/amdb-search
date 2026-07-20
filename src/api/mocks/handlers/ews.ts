import { http, HttpResponse } from 'msw'
import { sleep } from '../utils'
import { DEFAULT_DELAY } from '../config'

const CGI_EWS = '/cgi-bin/serg/0/6/9/reports/274/aprove_indicators_server.pl'

export const ewsHandlers = [
  http.post(CGI_EWS, async () => {
    await sleep(DEFAULT_DELAY)
    return HttpResponse.json([])
  })
]
