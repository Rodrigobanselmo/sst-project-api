import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
export declare class DeleteSoftGenerateSourceService {
    private readonly generateSourceRepository;
    constructor(generateSourceRepository: GenerateSourceRepository);
    execute(id: string, userPayloadDto: UserPayloadDto): Promise<import("../../../entities/generateSource.entity").GenerateSourceEntity>;
}
