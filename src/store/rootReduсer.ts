import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { openBillReducer, moduleName as OB }  from './ducks/openBill';
import { creditConveyorReducer, moduleName as CC } from './ducks/creditConveyor';
import EbgReducer, {  moduleName as Ebg } from './ducks/EBG';
import { earlyWarningSystemReducer, moduleName as EWS } from './ducks/earlyWarningSystem';
import { stopListSearchReducer, moduleName as SLS } from './ducks/stopListSearch';
import history from '../history'

export default combineReducers({
  [CC] : creditConveyorReducer,
  [OB] : openBillReducer,
  [Ebg]: EbgReducer,
  [EWS]: earlyWarningSystemReducer,
  [SLS]: stopListSearchReducer,
  router: connectRouter(history),
})