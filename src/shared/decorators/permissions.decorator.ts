import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/authorization';

export const PERMISSIONS_KEY = 'Permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
