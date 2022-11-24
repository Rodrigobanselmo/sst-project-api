import { CompanyGroupRepository } from './../../../repositories/implementations/CompanyGroupRepository';
import { FindCompanyGroupDto } from './../../../dto/company-group.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindAvailableCompanyGroupsService {
    private readonly companyGroupRepository;
    constructor(companyGroupRepository: CompanyGroupRepository);
    execute({ skip, take, ...query }: FindCompanyGroupDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/company-group.entity").CompanyGroupEntity[];
        count: number;
    }>;
}
