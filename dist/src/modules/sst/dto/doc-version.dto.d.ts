import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class FindDocVersionDto extends PaginationQueryDto {
    search: string;
    workspaceId: string;
    riskGroupId: string[];
    pcmsoId: string[];
    isPGR: boolean;
    isPCMSO: boolean;
}
