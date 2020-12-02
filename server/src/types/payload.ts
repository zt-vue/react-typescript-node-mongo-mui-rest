import { UserDocument } from 'models/user';
export type Payload = {
  user: UserDocument;
};

export enum UserRoles {
  admin = 'admin',
  owner = 'owner',
  regular = 'regular',
}
