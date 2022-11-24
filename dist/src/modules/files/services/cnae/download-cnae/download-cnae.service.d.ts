import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { ActivityRepository } from '../../../../company/repositories/implementations/ActivityRepository';
export declare class DownloadCnaeService {
    private readonly excelProvider;
    private readonly activityRepository;
    private readonly downloadExcelProvider;
    constructor(excelProvider: ExcelProvider, activityRepository: ActivityRepository, downloadExcelProvider: DownloadExcelProvider);
    execute(userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
