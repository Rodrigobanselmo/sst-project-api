import { CreateGenerateSourceDto } from '../../../../../modules/checklist/dto/generate-source.dto';
import { GenerateSourceRepository } from '../../../../../modules/checklist/repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CreateGenerateSourceService {
    private readonly generateSourceRepository;
    constructor(generateSourceRepository: GenerateSourceRepository);
    execute(createGenerateSourceDto: CreateGenerateSourceDto, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/generateSource.entity").GenerateSourceEntity>;
}
