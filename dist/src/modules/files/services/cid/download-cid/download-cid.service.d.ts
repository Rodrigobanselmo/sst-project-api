import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CidRepository } from '../../../../company/repositories/implementations/CidRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
export declare class DownloadCidService {
    private readonly excelProvider;
    private readonly cidRepository;
    private readonly downloadExcelProvider;
    constructor(excelProvider: ExcelProvider, cidRepository: CidRepository, downloadExcelProvider: DownloadExcelProvider);
    execute(userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
