import * as UserActions from './user.actions';
import * as Actions from 'store/actions/core';
import jwtService from 'services/jwtService';
import { ThunkAction } from 'redux-thunk';
import { ActionType, UserReducerType } from 'types';

interface RegisterFormType {
  name: string;
  password: string;
  email: string;
  role: string;
}
type MyRootState = {};
type MyExtraArg = undefined;
type MyThunkResult<R> = ThunkAction<R, MyRootState, MyExtraArg, any>;

export function submitRegister({
  name,
  password,
  email,
  role,
}: RegisterFormType): MyThunkResult<Promise<{ type: string }>> {
  return (dispatch) =>
    jwtService
      .createUser({
        name,
        password,
        email,
        role,
      })
      .then((user) => {
        dispatch(UserActions.setUserData(user as UserReducerType));
        dispatch(Actions.showMessage({ message: 'Register Success' }));
        return dispatch({
          type: ActionType.REGISTER_SUCCESS,
        });
      })
      .catch((error) => {
        return dispatch({
          type: ActionType.REGISTER_ERROR,
          payload: error,
        });
      });
}
