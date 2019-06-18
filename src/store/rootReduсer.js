import { combineReducers } from 'redux';
import openBillReducer from './ducks/openBill';
import creditConveyorReducer from './ducks/creditConveyor';
import electronicBankGarantiesReducer from './ducks/electronicBankGarantees';

export default combineReducers({
  creditConveyor : creditConveyorReducer,
  openBill : openBillReducer,
  electronicBankGaranties: electronicBankGarantiesReducer,
}) 



