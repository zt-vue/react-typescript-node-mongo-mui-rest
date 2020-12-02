import { ActionType, Action } from 'types';
import { LoginReducerType } from 'types';

const initialState: LoginReducerType = {
  success: undefined,
  error: '',
};

const login = function (
  state: LoginReducerType = initialState,
  action: Action<LoginReducerType>
) {
  switch (action.type) {
    case ActionType.LOGIN_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case ActionType.LOGIN_ERROR: {
      return {
        success: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default login;
