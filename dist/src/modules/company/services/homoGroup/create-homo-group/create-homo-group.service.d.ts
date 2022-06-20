import { CreateHomoGroupDto } from '../../../../../modules/company/dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateHomoGroupService {
    private readonly homoGroupRepository;
    constructor(homoGroupRepository: HomoGroupRepository);
    execute(homoGroup: CreateHomoGroupDto, user: UserPayloadDto): Promise<import("../../../entities/homoGroup.entity").HomoGroupEntity>;
}
