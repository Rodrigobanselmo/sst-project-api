import { PermissionEnum } from '../constants/enum/authorization';
export interface IPermissionOptions {
    code?: PermissionEnum;
    crud?: boolean | string;
    isMember?: boolean;
    isContract?: boolean;
}
export declare const PERMISSIONS_KEY = "Permissions";
export declare const Permissions: (...permissions: IPermissionOptions[]) => import("@nestjs/common").CustomDecorator<string>;
