import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteHomoGroupService {
    private readonly homoGroupRepository;
    constructor(homoGroupRepository: HomoGroupRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<void>;
}
