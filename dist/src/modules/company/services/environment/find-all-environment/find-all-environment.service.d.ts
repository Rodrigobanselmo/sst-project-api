import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class FindAllEnvironmentService {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity[]>;
}
