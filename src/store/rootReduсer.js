import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import openBillReducer from './ducks/openBill';
import creditConveyorReducer from './ducks/creditConveyor';
import electronicBankGarantiesReducer from './ducks/electronicBankGarantees';
import history from '../history'

export default combineReducers({
  creditConveyor : creditConveyorReducer,
  openBill : openBillReducer,
  electronicBankGaranties: electronicBankGarantiesReducer,
  router: connectRouter(history),
})