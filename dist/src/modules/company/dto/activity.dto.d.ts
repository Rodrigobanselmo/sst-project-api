import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class ActivityDto {
    name: string;
    code: string;
    riskDegree: number;
}
export declare class FindActivityDto extends PaginationQueryDto {
    search?: string;
    code?: string;
}
