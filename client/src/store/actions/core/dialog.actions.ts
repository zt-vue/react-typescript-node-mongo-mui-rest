import { ActionType, DialogReducerType } from 'types';

export function closeDialog() {
  return {
    type: ActionType.CLOSE_DIALOG,
  };
}

export function openDialog(payload: DialogReducerType) {
  return {
    type: ActionType.OPEN_DIALOG,
    payload,
  };
}
