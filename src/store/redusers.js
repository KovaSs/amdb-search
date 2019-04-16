import { combineReducers } from 'redux';
import openBillReducer from './openBill/redusers';

export default combineReducers({
  openBill : openBillReducer
}) 



