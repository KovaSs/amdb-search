import { combineReducers } from 'redux';
import openBillReducer from './openBill/reduсers';
import creditConveyorReducer from './creditConveyor/reduсers';
import electronicBankGarantiesReducer from './electronicBankGarantees/reduсers';
import stateAppReducer from './stateApp/reduсers';

export default combineReducers({
  creditConveyor : creditConveyorReducer,
  openBill : openBillReducer,
  electronicBankGaranties: electronicBankGarantiesReducer,
  stateApp : stateAppReducer
}) 



