import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/authorization';

export interface IPermissionOptions {
  code: Permission;
  crud?: boolean;
  checkCompany?: boolean;
  checkChild?: boolean;
}

export const PERMISSIONS_KEY = 'Permissions';
export const Permissions = (...permissions: IPermissionOptions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
