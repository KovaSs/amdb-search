import { combineReducers } from 'redux';
import openBillReducer from './openBill/redusers';
import creditConveyorReducer from './creditConveyor/redusers';

export default combineReducers({
  openBill : openBillReducer,
  creditConveyor : creditConveyorReducer
}) 



