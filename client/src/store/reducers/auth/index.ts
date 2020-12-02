import { combineReducers } from 'redux';
import user from './user.reducer';
import login from './login.reducer';
import register from './register.reducer';
import profile from './profile.reducer';

const authReducers = combineReducers({
  user,
  login,
  register,
  profile,
});

export default authReducers;
