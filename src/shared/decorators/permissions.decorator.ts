import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../constants/enum/authorization';

export interface IPermissionOptions {
  code?: PermissionEnum;
  crud?: boolean | string;
  isMember?: boolean;
  isContract?: boolean;
}

export const PERMISSIONS_KEY = 'Permissions';
export const Permissions = (...permissions: IPermissionOptions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
