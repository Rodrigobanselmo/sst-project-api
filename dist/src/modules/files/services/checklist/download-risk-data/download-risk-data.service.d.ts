import { RiskRepository } from '../../../../../modules/checklist/repositories/implementations/RiskRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare class DownloadRiskDataService {
    private readonly excelProvider;
    private readonly riskRepository;
    private readonly downloadExcelProvider;
    constructor(excelProvider: ExcelProvider, riskRepository: RiskRepository, downloadExcelProvider: DownloadExcelProvider);
    execute(userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
