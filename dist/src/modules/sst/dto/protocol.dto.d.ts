import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { StatusEnum } from '@prisma/client';
export declare class CreateProtocolDto {
    name: string;
    companyId?: string;
    status?: StatusEnum;
    system?: boolean;
}
export declare class UpdateProtocolDto {
    id?: number;
    name?: string;
    companyId: string;
}
export declare class UpdateProtocolRiskDto {
    protocolIds?: number[];
    companyId: string;
    riskIds: string[];
    minRiskDegree?: number;
    minRiskDegreeQuantity?: number;
}
export declare class FindProtocolDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
}
