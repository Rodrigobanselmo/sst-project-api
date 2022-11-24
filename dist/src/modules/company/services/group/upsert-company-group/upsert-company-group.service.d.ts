import { CompanyGroupRepository } from './../../../repositories/implementations/CompanyGroupRepository';
import { UpsertCompanyGroupDto } from './../../../dto/company-group.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpsertCompanyGroupsService {
    private readonly companyGroupRepository;
    constructor(companyGroupRepository: CompanyGroupRepository);
    execute(UpsertCompanyGroupsDto: UpsertCompanyGroupDto, user: UserPayloadDto): Promise<import("../../../entities/company-group.entity").CompanyGroupEntity>;
}
