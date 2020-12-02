import jwtService from 'services/jwtService';
import { setUserData } from './user.actions';
import { ThunkAction } from 'redux-thunk';
import { ActionType, UserReducerType } from 'types';
import * as Actions from 'store/actions/core';

interface LoginFormType {
  password: string;
  email: string;
}
type MyRootState = {};
type MyExtraArg = undefined;
type MyThunkResult<R> = ThunkAction<R, MyRootState, MyExtraArg, any>;
export function submitLogin({
  email,
  password,
}: LoginFormType): MyThunkResult<Promise<{ type: string }>> {
  return (dispatch) =>
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setUserData(user as UserReducerType));

        dispatch(Actions.showMessage({ message: 'Login Success' }));
        return dispatch({
          type: ActionType.LOGIN_SUCCESS,
        });
      })
      .catch((error) => {
        return dispatch({
          type: ActionType.LOGIN_ERROR,
          payload: error,
        });
      });
}
