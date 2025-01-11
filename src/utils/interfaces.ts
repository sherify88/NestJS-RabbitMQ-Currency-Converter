import { Request } from 'express';
import { User } from '../users/entities/user.entity';

export interface IRequestWithUser extends Request {
  user: User;
}
export enum Roles_En {
  Administrator = 'Administrator',
  Superadmin = 'Superadmin',
}



export interface ITokenPayload {
  id?: string;

}

export class IUploadedFile {
  name: string;
  path: string;
}






