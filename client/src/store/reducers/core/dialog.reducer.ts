import { ActionType, Action } from 'types';
import { DialogReducerType } from 'types';

const initialState: DialogReducerType = {
  state: false,
  options: {
    children: 'Hi',
  },
};

const dialog = function (
  state: DialogReducerType = initialState,
  action: Action<DialogReducerType>
) {
  switch (action.type) {
    case ActionType.OPEN_DIALOG: {
      return {
        ...state,
        state: true,
        options: {
          ...state.options,
          ...action.payload,
        },
      };
    }
    case ActionType.CLOSE_DIALOG: {
      return {
        ...state,
        state: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default dialog;
