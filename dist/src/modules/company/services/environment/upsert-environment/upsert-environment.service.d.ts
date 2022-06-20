/// <reference types="multer" />
import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class UpsertEnvironmentService {
    private readonly environmentRepository;
    private readonly environmentPhotoRepository;
    private readonly amazonStorageProvider;
    constructor(environmentRepository: EnvironmentRepository, environmentPhotoRepository: EnvironmentPhotoRepository, amazonStorageProvider: AmazonStorageProvider);
    execute({ photos, ...upsertEnvironmentDto }: UpsertEnvironmentDto, workspaceId: string, userPayloadDto: UserPayloadDto, files: Array<Express.Multer.File>): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
    private upload;
}
