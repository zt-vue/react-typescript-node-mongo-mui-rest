import { ActionType, Action } from 'types';
import { ProfileReducerType } from 'types';

const initialState: ProfileReducerType = {
  success: undefined,
  error: '',
};

const register = function (
  state: ProfileReducerType = initialState,
  action: Action<ProfileReducerType>
) {
  switch (action.type) {
    case ActionType.PROFILE_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case ActionType.PROFILE_ERROR: {
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

export default register;
