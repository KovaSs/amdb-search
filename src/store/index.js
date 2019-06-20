import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import rootReducer from './rootReduсer'
import thunk from 'redux-thunk'
import api from '../middlewares/api'
import logger from 'redux-logger'
import history from '../history'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk, 
    routerMiddleware(history), 
    api, 
    logger
  ),
  // other store enhancers if any
);

const store = createStore(rootReducer, enhancer)
window.store = store

export default store