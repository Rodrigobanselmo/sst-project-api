import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertAddCertDto } from '../../dto/add-cert.dto';
import { CompanyCertEntity } from '../../entities/companyCert.entity';
export declare class CompanyCertRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, ...rest }: UpsertAddCertDto): Promise<CompanyCertEntity>;
    findByCompanyId(companyId: string): Promise<CompanyCertEntity>;
}
