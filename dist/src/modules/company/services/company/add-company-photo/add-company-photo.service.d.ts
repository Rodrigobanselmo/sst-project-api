/// <reference types="multer" />
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
export declare class AddCompanyPhotoService {
    private readonly companyRepository;
    private readonly amazonStorageProvider;
    constructor(companyRepository: CompanyRepository, amazonStorageProvider: AmazonStorageProvider);
    execute(userPayloadDto: UserPayloadDto, file: Express.Multer.File): Promise<import("../../../entities/company.entity").CompanyEntity | (import(".prisma/client").Company & {
        workspace: import(".prisma/client").Workspace[];
        primary_activity: import(".prisma/client").Activity[];
        secondary_activity: import(".prisma/client").Activity[];
        license: import(".prisma/client").License;
        employees: import(".prisma/client").Employee[];
        group: import(".prisma/client").CompanyGroup;
        users: import(".prisma/client").UserCompany[];
        doctorResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
        tecResponsible: import(".prisma/client").ProfessionalCouncil & {
            professional: import(".prisma/client").Professional;
        };
    })>;
    private upload;
}
