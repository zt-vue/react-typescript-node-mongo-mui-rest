import { ActionType, MessageReducerType } from 'types';

export function hideMessage() {
  return {
    type: ActionType.HIDE_MESSAGE,
  };
}

export function showMessage(payload: MessageReducerType['options']) {
  return {
    type: ActionType.SHOW_MESSAGE,
    payload,
  };
}
