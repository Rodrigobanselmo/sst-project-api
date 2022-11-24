import { PrismaService } from '../../../../prisma/prisma.service';
import { ILicenseRepository } from '../ILicenseRepository.types';
import { LicenseEntity } from './../../entities/license.entity';
export declare class LicenseRepository implements ILicenseRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByCompanyId(companyId: string): Promise<LicenseEntity>;
}
