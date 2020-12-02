import { ActionType, Action } from 'types';
import { MessageReducerType } from 'types';

export const initialState = {
  state: false,
  options: {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    autoHideDuration: 6000,
    message: 'Hi',
    variant: null,
  },
};

const message = function (
  state: MessageReducerType = initialState,
  action: Action<MessageReducerType['options']>
) {
  switch (action.type) {
    case ActionType.SHOW_MESSAGE: {
      return {
        state: true,
        options: {
          ...initialState.options,
          ...action.payload,
        },
      };
    }
    case ActionType.HIDE_MESSAGE: {
      return {
        ...state,
        state: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default message;
