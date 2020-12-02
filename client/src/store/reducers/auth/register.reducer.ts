import { ActionType, Action } from 'types';
import { RegisterReducerType } from 'types';

const initialState: RegisterReducerType = {
  success: undefined,
  error: '',
};

const register = function (
  state: RegisterReducerType = initialState,
  action: Action<RegisterReducerType>
) {
  switch (action.type) {
    case ActionType.REGISTER_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case ActionType.REGISTER_ERROR: {
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
