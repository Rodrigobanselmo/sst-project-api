/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertCharacterizationDto, AddPhotoCharacterizationDto, UpdatePhotoCharacterizationDto, CopyCharacterizationDto } from '../../dto/characterization.dto';
import { DeleteCharacterizationService } from '../../services/characterization/delete-characterization/delete-characterization.service';
import { FindAllCharacterizationService } from '../../services/characterization/find-all-characterization/find-all-characterization.service';
import { UpsertCharacterizationService } from '../../services/characterization/upsert-characterization/upsert-characterization.service';
import { AddCharacterizationPhotoService } from '../../services/characterization/add-characterization-photo/add-characterization-photo.service';
import { DeleteCharacterizationPhotoService } from '../../services/characterization/delete-characterization-photo/delete-characterization-photo.service';
import { FindByIdCharacterizationService } from '../../services/characterization/find-by-id-characterization/find-by-id-characterization.service';
import { UpdateCharacterizationPhotoService } from '../../services/characterization/update-characterization-photo/update-characterization-photo.service';
import { CopyCharacterizationService } from '../../services/characterization/copy-characterization/copy-characterization.service';
export declare class CharacterizationController {
    private readonly upsertCharacterizationService;
    private readonly findAllCharacterizationService;
    private readonly deleteCharacterizationService;
    private readonly addCharacterizationPhotoService;
    private readonly deleteCharacterizationPhotoService;
    private readonly findByIdCharacterizationService;
    private readonly updateCharacterizationPhotoService;
    private readonly copyCharacterizationService;
    constructor(upsertCharacterizationService: UpsertCharacterizationService, findAllCharacterizationService: FindAllCharacterizationService, deleteCharacterizationService: DeleteCharacterizationService, addCharacterizationPhotoService: AddCharacterizationPhotoService, deleteCharacterizationPhotoService: DeleteCharacterizationPhotoService, findByIdCharacterizationService: FindByIdCharacterizationService, updateCharacterizationPhotoService: UpdateCharacterizationPhotoService, copyCharacterizationService: CopyCharacterizationService);
    findAll(userPayloadDto: UserPayloadDto, workspaceId: string): Promise<import("../../entities/characterization.entity").CharacterizationEntity[]>;
    findById(userPayloadDto: UserPayloadDto, id: string): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    upsert(body: UpsertCharacterizationDto, userPayloadDto: UserPayloadDto, workspaceId: string, files?: Array<Express.Multer.File>): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    uploadRiskFile(file: Express.Multer.File, addPhotoCharacterizationDto: AddPhotoCharacterizationDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    update(updatePhotoCharacterizationDto: UpdatePhotoCharacterizationDto, id: string): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    deletePhoto(id: string): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    delete(id: string, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/characterization.entity").CharacterizationEntity>;
    copy(copyCharacterizationDto: CopyCharacterizationDto, workspaceId: string, userPayloadDto: UserPayloadDto): Promise<{}>;
}
