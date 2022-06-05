import { CreateDatabaseTableDto } from '../dto/create-database-table.dto';
import { DatabaseTableEntity } from '../entities/databaseTable.entity';
interface IDatabaseTableRepository {
    upsert(createDatabaseTableDto: CreateDatabaseTableDto, companyId: string, system: boolean, id: number): Promise<DatabaseTableEntity>;
}
export { IDatabaseTableRepository };
