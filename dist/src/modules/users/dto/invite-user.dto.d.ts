import { PermissionEnum, RoleEnum } from 'src/shared/constants/enum/authorization';
export declare class InviteUserDto {
    readonly email: string;
    readonly companyId: string;
    readonly permissions: PermissionEnum[];
    readonly roles?: RoleEnum[];
}