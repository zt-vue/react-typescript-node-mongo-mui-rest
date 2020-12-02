import { combineReducers } from 'redux';
import message from './message.reducer';
import dialog from './dialog.reducer';

const coreReducers = combineReducers({
  message,
  dialog,
});

export default coreReducers;
