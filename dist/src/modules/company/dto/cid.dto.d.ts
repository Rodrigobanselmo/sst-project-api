import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class CidDto {
    cid: string;
    description: string;
}
export declare class FindCidDto extends PaginationQueryDto {
    search?: string;
    cid?: string;
}
