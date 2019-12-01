import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
import rootReducer from './rootReduсer'
import history from '../history'
import config from '../config'

declare global {
  interface Window { 
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    store: any;
  }
}

if(process.env.NODE_ENV === "production" && config.production) {
  const noop = () => {}
  console.log = noop
}

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  && !config.production ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const sagaMiddleware = createSagaMiddleware()

const enhancerDev = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(history)
  ),
);

const enhancerProd = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    routerMiddleware(history)
  ),
);

const enhancer = config.production ? enhancerProd : enhancerDev

const store = createStore(rootReducer, enhancer)
window.store = store

sagaMiddleware.run(rootSaga)

export default store