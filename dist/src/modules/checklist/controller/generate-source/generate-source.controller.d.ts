import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateGenerateSourceDto, UpdateGenerateSourceDto } from '../../dto/generate-source.dto';
import { CreateGenerateSourceService } from '../../services/generate-source/create-generate-source/create-generate-source.service';
import { DeleteSoftGenerateSourceService } from '../../services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service';
import { UpdateGenerateSourceService } from '../../services/generate-source/update-generate-source/update-generate-source.service';
export declare class GenerateSourceController {
    private readonly createGenerateSourceService;
    private readonly updateGenerateSourceService;
    private readonly deleteSoftGenerateSourceService;
    constructor(createGenerateSourceService: CreateGenerateSourceService, updateGenerateSourceService: UpdateGenerateSourceService, deleteSoftGenerateSourceService: DeleteSoftGenerateSourceService);
    create(userPayloadDto: UserPayloadDto, createGenerateSourceDto: CreateGenerateSourceDto): Promise<import("../../entities/generateSource.entity").GenerateSourceEntity>;
    update(generateSourceId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateGenerateSourceDto): Promise<import("../../entities/generateSource.entity").GenerateSourceEntity>;
    deleteSoft(generateSourceId: string, userPayloadDto: UserPayloadDto): Promise<import("../../entities/generateSource.entity").GenerateSourceEntity>;
}
