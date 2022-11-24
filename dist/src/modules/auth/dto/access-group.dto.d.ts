import { RoleEnum } from './../../../shared/constants/enum/authorization';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class UpsertAccessGroupDto {
    id: number;
    name: string;
    description: string;
    companyId: string;
    readonly permissions: string[];
    readonly roles?: RoleEnum[];
}
export declare class FindAccessGroupDto extends PaginationQueryDto {
    id: number;
    search: string;
    roles: string[];
    permissions: string[];
}
