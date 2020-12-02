export interface Action<T> {
  type: IActionType;
  payload: T;
}

enum AuthType {
  SET_USER_DATA = '[USER] SET DATA',
  REMOVE_USER_DATA = '[USER] REMOVE DATA',
  USER_LOGGED_OUT = '[USER] LOGGED OUT',

  REGISTER_ERROR = 'REGISTER_ERROR',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',

  LOGIN_ERROR = 'LOGIN_ERROR',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  PROFILE_SUCCESS = 'PROFILE_SUCCESS',
  PROFILE_ERROR = 'PROFILE_ERROR',
}

enum CoreType {
  OPEN_DIALOG = '[DIALOG] OPEN',
  CLOSE_DIALOG = '[DIALOG] CLOSE',

  HIDE_MESSAGE = '[MESSAGE] CLOSE',
  SHOW_MESSAGE = '[MESSAGE] SHOW',
}

export type IActionType = AuthType | CoreType;

export const ActionType = {
  ...AuthType,
  ...CoreType,
};
