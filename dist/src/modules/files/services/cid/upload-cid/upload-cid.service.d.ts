/// <reference types="multer" />
import { CidRepository } from '../../../../company/repositories/implementations/CidRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
export declare class UploadCidDataService {
    private readonly excelProvider;
    private readonly cidRepo;
    private readonly databaseTableRepository;
    private readonly uploadExcelProvider;
    constructor(excelProvider: ExcelProvider, cidRepo: CidRepository, databaseTableRepository: DatabaseTableRepository, uploadExcelProvider: UploadExcelProvider);
    execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
