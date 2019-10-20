import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
import rootReducer from './rootReduсer'
import history from '../history'
import config from '../config'

if(process.env.NODE_ENV === "production" && config.production) {
  const noop = () => {}
  console.log = noop
}

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  && !config.production ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const sagaMiddleware = createSagaMiddleware()

const enhancerDev = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(history),
    logger
  ),
  // other store enhancers if any
);

const enhancerProd = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(history)
  ),
  // other store enhancers if any
);

const enhancer = config.production ? enhancerProd : enhancerDev

const store = createStore(rootReducer, enhancer)
window.store = store

sagaMiddleware.run(rootSaga)

export default store