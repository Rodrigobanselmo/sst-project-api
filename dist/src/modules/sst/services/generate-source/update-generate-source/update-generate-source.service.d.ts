import { UpdateGenerateSourceDto } from '../../../dto/generate-source.dto';
import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateGenerateSourceService {
    private readonly generateSourceRepository;
    constructor(generateSourceRepository: GenerateSourceRepository);
    execute(id: string, updateGenerateSourceDto: UpdateGenerateSourceDto, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/generateSource.entity").GenerateSourceEntity>;
}
