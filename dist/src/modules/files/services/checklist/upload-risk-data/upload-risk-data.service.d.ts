/// <reference types="multer" />
import { RiskRepository } from '../../../../sst/repositories/implementations/RiskRepository';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadChecklistDataService {
    private readonly excelProvider;
    private readonly riskRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    constructor(excelProvider: ExcelProvider, riskRepository: RiskRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
