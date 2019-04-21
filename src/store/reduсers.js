import { combineReducers } from 'redux';
import openBillReducer from './openBill/reduсers';
import creditConveyorReducer from './creditConveyor/reduсers';
import stateAppReducer from './stateApp/reduсers';

export default combineReducers({
  creditConveyor : creditConveyorReducer,
  openBill : openBillReducer,
  stateApp : stateAppReducer
}) 



