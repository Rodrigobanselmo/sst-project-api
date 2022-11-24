import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class FindESocialEventDto extends PaginationQueryDto {
    search: string;
    companyId: string;
}
