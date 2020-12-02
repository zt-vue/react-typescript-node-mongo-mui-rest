import { ActionType, Action } from 'types';
import { UserReducerType } from 'types';

const initialState: UserReducerType = {
  role: [], //guest
  name: 'John Doe',
  photoURL: 'assets/images/avatars/Velazquez.jpg',
  email: 'johndoe@withinpixels.com',
};

const user = function (
  state: UserReducerType = initialState,
  action: Action<UserReducerType>
) {
  switch (action.type) {
    case ActionType.SET_USER_DATA: {
      return {
        ...initialState,
        ...action.payload,
      };
    }
    case ActionType.REMOVE_USER_DATA: {
      return {
        ...initialState,
      };
    }
    case ActionType.USER_LOGGED_OUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default user;
