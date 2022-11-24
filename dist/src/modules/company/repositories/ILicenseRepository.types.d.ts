import { LicenseEntity } from './../entities/license.entity';
interface ILicenseRepository {
    findByCompanyId(companyId: string): Promise<LicenseEntity | undefined>;
}
export { ILicenseRepository };
