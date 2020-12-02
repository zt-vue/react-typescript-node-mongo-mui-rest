import * as UserActions from './user.actions';
import jwtService from 'services/jwtService';
import { ThunkAction } from 'redux-thunk';
import { ActionType, UserReducerType } from 'types';
import * as Actions from 'store/actions/core';

interface ProfileFormType {
  name: string;
  password?: string;
  email: string;
  isUpdatePassword: boolean;
}
type MyRootState = {};
type MyExtraArg = undefined;
type MyThunkResult<R> = ThunkAction<R, MyRootState, MyExtraArg, any>;

export function profileUpdate({
  name,
  email,
  isUpdatePassword,
  password,
}: ProfileFormType): MyThunkResult<Promise<{ type: string }>> {
  return (dispatch) =>
    jwtService
      .updateProfile({
        name,
        password,
        email,
        isUpdatePassword,
      })
      .then((user) => {
        dispatch(UserActions.setUserData(user as UserReducerType));
        dispatch(Actions.showMessage({ message: 'Profile Update Success' }));
        return dispatch({
          type: ActionType.REGISTER_SUCCESS,
        });
      })
      .catch((error) => {
        return dispatch(Actions.showMessage({ message: error }));
      });
}
