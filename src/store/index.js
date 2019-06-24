import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'
import rootReducer from './rootReduсer'
import api from '../middlewares/api'
import history from '../history'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    thunk, 
    routerMiddleware(history), 
    api, 
    logger
  ),
  // other store enhancers if any
);

const store = createStore(rootReducer, enhancer)
window.store = store

sagaMiddleware.run(rootSaga)

export default store