/// <reference types="multer" />
import { EnvironmentPhotoRepository } from '../../../../../modules/company/repositories/implementations/EnvironmentPhotoRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { AddPhotoEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';
export declare class AddEnvironmentPhotoService {
    private readonly environmentRepository;
    private readonly environmentPhotoRepository;
    private readonly amazonStorageProvider;
    constructor(environmentRepository: EnvironmentRepository, environmentPhotoRepository: EnvironmentPhotoRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(addPhotoEnvironmentDto: AddPhotoEnvironmentDto, userPayloadDto: UserPayloadDto, file: Express.Multer.File): Promise<import("../../../entities/environment.entity").EnvironmentEntity>;
    private upload;
}
