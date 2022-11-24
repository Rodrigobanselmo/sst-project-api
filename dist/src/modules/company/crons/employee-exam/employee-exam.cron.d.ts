import { UpdateAllCompaniesService } from '../../services/report/update-all-companies/update-all-companies.service';
export declare class UpdateCompaniesReportCron {
    private readonly updateAllCompaniesService;
    constructor(updateAllCompaniesService: UpdateAllCompaniesService);
    handleCron(): Promise<void>;
}
