import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class DeleteEnvironmentPhotoService {
    private readonly environmentRepository;
    private readonly environmentPhotoRepository;
    private readonly amazonStorageProvider;
    constructor(environmentRepository: EnvironmentRepository, environmentPhotoRepository: EnvironmentPhotoRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(id: string): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
}
