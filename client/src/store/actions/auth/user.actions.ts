import history from '@history';
// import store from 'store';
// import * as Actions from 'app/store/actions';
import jwtService from 'services/jwtService';
import { ActionType, RootState, UserReducerType } from 'types';
import { ThunkAction } from 'redux-thunk';

/**
 * Set User Data
 */
export function setUserData(user: UserReducerType) {
  return {
    type: ActionType.SET_USER_DATA,
    payload: user,
  };
}

/**
 * Remove User Data
 */
export function removeUserData() {
  return {
    type: ActionType.REMOVE_USER_DATA,
  };
}
/**
 * Logout
 */

type MyExtraArg = undefined;
type MyThunkResult<R> = ThunkAction<R, RootState, MyExtraArg, any>;

export function logoutUser(): MyThunkResult<{ type: string }> {
  return (dispatch, getState) => {
    // if (!user.role || user.role.length === 0) {
    //   // is guest
    //   return null;
    // }
    history.push({
      pathname: '/',
    });
    jwtService.logout();
    return dispatch({
      type: ActionType.USER_LOGGED_OUT,
    });
  };
}

/**
 * Update User Data
 */
// function updateUserData(user)
// {
// 	if ( !user.role || user.role.length === 0 )// is guest
// 	{
// 		return;
// 	}
// 	jwtService.updateUserData(user)
// 		.then(() => {
// 			store.dispatch(Actions.showMessage({message: 'User data saved with api'}));
// 		})
// 		.catch(error => {
// 			store.dispatch(Actions.showMessage({message: error.message}));
// 		});
// }
