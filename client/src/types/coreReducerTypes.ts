export interface DialogReducerType {
  state: boolean;
  options: any;
}

export interface MessageReducerType {
  state: boolean;
  options: {
    anchorOrigin?: {
      vertical: string;
      horizontal: string;
    };
    autoHideDuration?: number;
    message: string;
    variant?: any;
  };
}

export interface CoreReducerType {
  dialog: DialogReducerType;
  message: MessageReducerType;
}
