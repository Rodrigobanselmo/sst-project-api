import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class DeleteEnvironmentService {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
