import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import openBillReducer, {  moduleName as OB }  from './ducks/openBill';
import creditConveyorReducer, { moduleName as CC } from './ducks/creditConveyor';
import electronicBankGarantiesReducer, {  moduleName as EBG } from './ducks/electronicBankGarantees';
import history from '../history'

export default combineReducers({
  [CC] : creditConveyorReducer,
  [OB] : openBillReducer,
  [EBG]: electronicBankGarantiesReducer,
  router: connectRouter(history),
})