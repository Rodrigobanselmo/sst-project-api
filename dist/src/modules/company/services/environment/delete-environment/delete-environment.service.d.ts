import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
import { AmazonStorageProvider } from './../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EnvironmentPhotoRepository } from './../../../repositories/implementations/EnvironmentPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class DeleteEnvironmentService {
    private readonly environmentRepository;
    private readonly environmentPhotoRepository;
    private readonly amazonStorageProvider;
    private readonly homoGroupRepository;
    constructor(environmentRepository: EnvironmentRepository, environmentPhotoRepository: EnvironmentPhotoRepository, amazonStorageProvider: AmazonStorageProvider, homoGroupRepository: HomoGroupRepository);
    execute(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
