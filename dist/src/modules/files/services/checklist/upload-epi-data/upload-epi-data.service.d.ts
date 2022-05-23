/// <reference types="multer" />
import { EpiRepository } from 'src/modules/checklist/repositories/implementations/EpiRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadEpiDataService {
    private readonly excelProvider;
    private readonly epiRepository;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    constructor(excelProvider: ExcelProvider, epiRepository: EpiRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
