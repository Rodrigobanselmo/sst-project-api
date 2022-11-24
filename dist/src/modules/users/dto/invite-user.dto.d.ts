import { RoleEnum } from '../../../shared/constants/enum/authorization';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class InviteUserDto {
    readonly email: string;
    readonly groupId?: number;
    readonly companyId: string;
    companiesIds?: string[];
    readonly permissions: string[];
    readonly roles?: RoleEnum[];
}
export declare class FindInvitesDto extends PaginationQueryDto {
    ids?: string[];
    showProfessionals?: boolean;
}
