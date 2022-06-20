/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertEnvironmentDto, AddPhotoEnvironmentDto } from '../../dto/environment.dto';
import { DeleteEnvironmentService } from '../../services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from '../../services/environment/find-all-environment/find-all-environment.service';
import { UpsertEnvironmentService } from '../../services/environment/upsert-environment/upsert-environment.service';
import { AddEnvironmentPhotoService } from '../../services/environment/add-environment-photo/add-environment-photo.service';
import { DeleteEnvironmentPhotoService } from '../../services/environment/delete-environment-photo/delete-environment-photo.service';
export declare class EnvironmentController {
    private readonly upsertEnvironmentService;
    private readonly findAllEnvironmentService;
    private readonly deleteEnvironmentService;
    private readonly addEnvironmentPhotoService;
    private readonly deleteEnvironmentPhotoService;
    constructor(upsertEnvironmentService: UpsertEnvironmentService, findAllEnvironmentService: FindAllEnvironmentService, deleteEnvironmentService: DeleteEnvironmentService, addEnvironmentPhotoService: AddEnvironmentPhotoService, deleteEnvironmentPhotoService: DeleteEnvironmentPhotoService);
    findAll(userPayloadDto: UserPayloadDto, workspaceId: string): Promise<import("../../entities/environment.entity").EnvironmentEntity[]>;
    upsert(upsertEnvironmentDto: UpsertEnvironmentDto, userPayloadDto: UserPayloadDto, workspaceId: string, files?: Array<Express.Multer.File>): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
    uploadRiskFile(file: Express.Multer.File, addPhotoEnvironmentDto: AddPhotoEnvironmentDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
    deletePhoto(id: string): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
    delete(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
}
