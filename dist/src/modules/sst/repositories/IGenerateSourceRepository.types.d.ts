import { CreateGenerateSourceDto } from '../dto/generate-source.dto';
import { GenerateSourceEntity } from '../entities/generateSource.entity';
interface IGenerateSourceRepository {
    create(createGenerateSourceDto: CreateGenerateSourceDto, system: boolean): Promise<GenerateSourceEntity | undefined>;
}
export { IGenerateSourceRepository };
