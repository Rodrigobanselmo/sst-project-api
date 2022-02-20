import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/enum/authorization';

export interface IPermissionOptions {
  code?: Permission;
  crud?: boolean;
  isMember?: boolean;
  isContract?: boolean;
}

export const PERMISSIONS_KEY = 'Permissions';
export const Permissions = (...permissions: IPermissionOptions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
