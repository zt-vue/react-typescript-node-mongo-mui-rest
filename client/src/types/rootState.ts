import { AuthReducerType, CoreReducerType } from 'types';
export interface RootState {
  core: CoreReducerType;
  auth: AuthReducerType;
}
