export interface LoginReducerType {
  success: boolean | undefined;
  error: string;
}

export interface RegisterReducerType {
  success: boolean | undefined;
  error: string;
}

export interface ProfileReducerType {
  success: boolean | undefined;
  error: string;
}

export interface UserReducerType {
  role: string | string[];
  name: string;
  photoURL: string;
  email: string;
}

export interface AuthReducerType {
  login: LoginReducerType;
  register: RegisterReducerType;
  user: UserReducerType;
  profile: ProfileReducerType;
}
