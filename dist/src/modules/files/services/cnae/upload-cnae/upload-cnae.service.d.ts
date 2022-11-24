/// <reference types="multer" />
import { ActivityRepository } from './../../../../company/repositories/implementations/ActivityRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadCnaeDataService {
    private readonly excelProvider;
    private readonly activityRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    constructor(excelProvider: ExcelProvider, activityRepository: ActivityRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
