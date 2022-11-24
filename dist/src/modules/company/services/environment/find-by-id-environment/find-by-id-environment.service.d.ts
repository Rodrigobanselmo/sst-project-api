import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class FindByIdEnvironmentService {
    private readonly environmentRepository;
    constructor(environmentRepository: EnvironmentRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
