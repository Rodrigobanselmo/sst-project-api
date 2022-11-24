import { FindHomogeneousGroupDto } from './../../../dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindHomogenousGroupService {
    private readonly homoGroupRepository;
    constructor(homoGroupRepository: HomoGroupRepository);
    execute({ skip, take, ...query }: FindHomogeneousGroupDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/homoGroup.entity").HomoGroupEntity[];
        count: number;
    }>;
}
