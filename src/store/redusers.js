import { combineReducers } from 'redux';
import lessonReducer from './lessons/redusers';

export default combineReducers({
  lessons : lessonReducer
}) 



