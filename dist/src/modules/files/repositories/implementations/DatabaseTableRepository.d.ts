import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDatabaseTableDto } from '../../dto/create-database-table.dto';
import { IDatabaseTableRepository } from '../IDatabaseTableRepository.types';
import { DatabaseTableEntity } from './../../entities/databaseTable.entity';
export declare class DatabaseTableRepository implements IDatabaseTableRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert(createDatabaseTableDto: CreateDatabaseTableDto, companyId: string, system: boolean, id?: number): Promise<DatabaseTableEntity>;
    findByNameAndCompany(name: string, companyId: string): Promise<DatabaseTableEntity>;
}
