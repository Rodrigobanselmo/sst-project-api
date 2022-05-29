import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateGenerateSourceDto, UpdateGenerateSourceDto } from '../../dto/generate-source.dto';
import { CreateGenerateSourceService } from '../../services/generate-source/create-generate-source/create-generate-source.service';
import { UpdateGenerateSourceService } from '../../services/generate-source/update-generate-source/update-generate-source.service';
export declare class GenerateSourceController {
    private readonly createGenerateSourceService;
    private readonly updateGenerateSourceService;
    constructor(createGenerateSourceService: CreateGenerateSourceService, updateGenerateSourceService: UpdateGenerateSourceService);
    create(userPayloadDto: UserPayloadDto, createGenerateSourceDto: CreateGenerateSourceDto): Promise<import("../../entities/generateSource.entity").GenerateSourceEntity>;
    update(generateSourceId: string, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateGenerateSourceDto): Promise<import("../../entities/generateSource.entity").GenerateSourceEntity>;
}
