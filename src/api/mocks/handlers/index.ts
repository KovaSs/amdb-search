import { openBillHandlers } from './openBill'
import { stopListHandlers } from './stopList'
import { fkdoHandlers } from './fkdo'
import { ebgHandlers } from './ebg'
import { ewsHandlers } from './ews'
import { viewerHandlers } from './viewer'

export const handlers = [
  ...openBillHandlers,
  ...stopListHandlers,
  ...fkdoHandlers,
  ...ebgHandlers,
  ...ewsHandlers,
  ...viewerHandlers
]
