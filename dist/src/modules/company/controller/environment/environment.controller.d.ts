/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertEnvironmentDto, UpsertPhotoEnvironmentDto } from '../../dto/environment.dto';
import { DeleteEnvironmentService } from '../../services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from '../../services/environment/find-all-environment/find-all-environment.service';
import { UpsertEnvironmentService } from '../../services/environment/upsert-environment/upsert-environment.service';
export declare class EnvironmentController {
    private readonly upsertEnvironmentService;
    private readonly findAllEnvironmentService;
    private readonly deleteEnvironmentService;
    constructor(upsertEnvironmentService: UpsertEnvironmentService, findAllEnvironmentService: FindAllEnvironmentService, deleteEnvironmentService: DeleteEnvironmentService);
    findAll(userPayloadDto: UserPayloadDto, workspaceId: string): Promise<import("../../entities/environment.entity").EnvironmentEntity[]>;
    upsert(upsertEnvironmentDto: UpsertEnvironmentDto, userPayloadDto: UserPayloadDto, workspaceId: string, files?: Array<Express.Multer.File>): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
    uploadRiskFile(file: Express.Multer.File, upsertPhotoEnvironmentDto: UpsertPhotoEnvironmentDto, userPayloadDto: UserPayloadDto, workspaceId: string): Promise<UpsertPhotoEnvironmentDto>;
    deletePhoto(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
    delete(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/environment.entity").EnvironmentEntity>;
}
