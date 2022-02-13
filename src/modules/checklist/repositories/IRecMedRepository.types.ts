import { CreateRecMedDto } from '../dto/create-rec-med.dto';
import { RecMedEntity } from '../entities/recMed.entity';

interface IRecMedRepository {
  create(
    createRecMedDto: CreateRecMedDto,
    system: boolean,
  ): Promise<RecMedEntity | undefined>;
}
export { IRecMedRepository };
