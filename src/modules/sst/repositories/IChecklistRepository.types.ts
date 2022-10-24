import { CreateChecklistDto } from '../dto/create-checklist.dto';
import { ChecklistEntity } from '../entities/checklist.entity';

interface IChecklistRepository {
  create(
    createChecklistDto: CreateChecklistDto,
    system: boolean,
  ): Promise<ChecklistEntity | undefined>;
  findAllAvailable(companyId?: string): Promise<ChecklistEntity[]>;
  findChecklistData(id: number, companyId: string): Promise<ChecklistEntity>;
}
export { IChecklistRepository };
