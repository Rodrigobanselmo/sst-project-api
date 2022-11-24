import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateProtocolToRiskDto {
    protocolId: number;
    riskId: string;
    companyId: string;
    minRiskDegree: number;
    minRiskDegreeQuantity: number;
}
declare const UpdateProtocolToRiskDto_base: import("@nestjs/common").Type<Partial<CreateProtocolToRiskDto>>;
export declare class UpdateProtocolToRiskDto extends UpdateProtocolToRiskDto_base {
    id?: number;
}
export declare class CopyProtocolToRiskDto {
    fromCompanyId: string;
    companyId: string;
    overwrite?: boolean;
}
export declare class UpsertManyProtocolToRiskDto {
    data: UpdateProtocolToRiskDto[];
    companyId: string;
}
export declare class FindProtocolToRiskDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
}
export {};
