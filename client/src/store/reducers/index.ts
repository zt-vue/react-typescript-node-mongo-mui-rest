import { combineReducers } from 'redux';
import auth from 'store/reducers/auth';
import core from 'store/reducers/core';

const createReducer = (asyncReducers?: any) =>
  combineReducers({
    auth,
    core,
    ...asyncReducers,
  });

export default createReducer;
