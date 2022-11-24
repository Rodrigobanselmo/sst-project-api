import { UpdatePhotoEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentPhotoRepository } from '../../../repositories/implementations/EnvironmentPhotoRepository';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class UpdateEnvironmentPhotoService {
    private readonly environmentRepository;
    private readonly environmentPhotoRepository;
    constructor(environmentRepository: EnvironmentRepository, environmentPhotoRepository: EnvironmentPhotoRepository);
    execute(id: string, updatePhotoEnvironmentDto: UpdatePhotoEnvironmentDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
