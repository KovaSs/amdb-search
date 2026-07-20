import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { MOCKS_ENABLED_KEY } from './config'
import config from '../../config'

const isEnabled = (): boolean => {
  if (process.env.REACT_APP_USE_MOCKS === 'true') return true
  try {
    const stored = localStorage.getItem(MOCKS_ENABLED_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

let startPromise: Promise<any> | null = null

export const setupMocks = (): void => {
  if (!isEnabled()) return

  config.devServer = window.location.origin

  const worker = setupWorker(...handlers)

  startPromise = worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true
  })

  console.groupCollapsed('%c[mocks] MSW worker started', 'color: #52c41a; font-weight: bold')
  console.log(`Toggle: localStorage.${MOCKS_ENABLED_KEY} = true`)
  console.log(`Env: REACT_APP_USE_MOCKS = true`)
  console.log(`Config api: ${config.api()}`)
  console.groupEnd()
}

export const mocksReady = (): Promise<any> => startPromise || Promise.resolve()
