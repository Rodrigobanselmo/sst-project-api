import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
export declare class FindHomogenousGroupByIdService {
    private readonly homoGroupRepository;
    constructor(homoGroupRepository: HomoGroupRepository);
    execute(id: string, user: UserPayloadDto): Promise<import("../../../entities/homoGroup.entity").HomoGroupEntity>;
}
