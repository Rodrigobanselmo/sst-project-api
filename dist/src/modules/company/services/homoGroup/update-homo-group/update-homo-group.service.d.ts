import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { UpdateHomoGroupDto } from '../../../../../modules/company/dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateHomoGroupService {
    private readonly homoGroupRepository;
    private readonly employeePPPHistoryRepository;
    constructor(homoGroupRepository: HomoGroupRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(homoGroup: UpdateHomoGroupDto, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/homoGroup.entity").HomoGroupEntity>;
}
