import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class UpsertCompanyGroupDto {
    id: number;
    name: string;
    description: string;
    companyId: string;
    numAsos?: number;
    blockResignationExam?: boolean;
    esocialStart?: Date;
    doctorResponsibleId: number;
    tecResponsibleId?: number;
    esocialSend?: boolean;
    companiesIds: string[];
}
export declare class FindCompanyGroupDto extends PaginationQueryDto {
    id: number;
    search: string[];
    name: string;
}
