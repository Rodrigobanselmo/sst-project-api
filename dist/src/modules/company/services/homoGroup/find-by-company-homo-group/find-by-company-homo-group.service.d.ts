import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindByCompanyHomoGroupService {
    private readonly homoGroupRepository;
    constructor(homoGroupRepository: HomoGroupRepository);
    execute(user: UserPayloadDto): Promise<import("../../../entities/homoGroup.entity").HomoGroupEntity[]>;
}
