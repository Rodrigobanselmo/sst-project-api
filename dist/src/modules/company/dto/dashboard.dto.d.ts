import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class FindCompanyDashDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
    companiesIds?: string[];
}
