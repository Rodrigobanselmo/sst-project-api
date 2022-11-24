import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { PdfGuideDataService } from '../services/pdf/guide/guide-data.service';
import { PdfKitDataService } from '../services/pdf/kit/kit-data.service';
import { PdfProntuarioDataService } from '../services/pdf/prontuario/prontuario-data.service';
import { PdfAsoDataService } from '../services/pdf/aso/aso-data.service';
export declare class DocumentsPdfController {
    private readonly pdfGuideDataService;
    private readonly pdfKitDataService;
    private readonly pdfAsoDataService;
    private readonly pdfProntuarioDataService;
    constructor(pdfGuideDataService: PdfGuideDataService, pdfKitDataService: PdfKitDataService, pdfAsoDataService: PdfAsoDataService, pdfProntuarioDataService: PdfProntuarioDataService);
    guide(userPayloadDto: UserPayloadDto, employeeId: number): Promise<import("../services/pdf/guide/types/IGuideData.type").IPdfGuideData>;
    aso(userPayloadDto: UserPayloadDto, employeeId: number, asoId: number): Promise<import("../services/pdf/aso/types/IAsoData.type").IPdfAsoData>;
    prontuario(userPayloadDto: UserPayloadDto, employeeId: number): Promise<import("../services/pdf/prontuario/types/IProntuarioData.type").IPdfProntuarioData>;
    kit(userPayloadDto: UserPayloadDto, employeeId: number, asoId: number): Promise<{
        aso: import("../services/pdf/aso/types/IAsoData.type").IPdfAsoData;
        prontuario: {
            examination: import("../services/pdf/prontuario/types/IProntuarioData.type").IProntuarioQuestion[];
            questions: import("../services/pdf/prontuario/types/IProntuarioData.type").IProntuarioQuestion[];
        };
    }>;
}
