import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { UpdateHierarchyHomoGroupDto } from '../../../dto/homoGroup';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateHierarchyHomoGroupService {
    private readonly homoGroupRepository;
    private readonly employeePPPHistoryRepository;
    constructor(homoGroupRepository: HomoGroupRepository, employeePPPHistoryRepository: EmployeePPPHistoryRepository);
    execute(homoGroup: UpdateHierarchyHomoGroupDto, userPayloadDto: UserPayloadDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
