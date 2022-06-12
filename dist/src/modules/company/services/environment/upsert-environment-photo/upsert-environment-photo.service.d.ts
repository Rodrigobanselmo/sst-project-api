import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class UpsertEnvironmentService {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(upsertEnvironmentDto: UpsertEnvironmentDto, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
