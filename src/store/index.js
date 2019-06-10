import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reduсers'
// import api from '../middlewares/api'
import thunk from '../services/redux-thunk'
// import logger from '../middlewares/logger'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

const store = createStore(rootReducer, enhancer)

export default store