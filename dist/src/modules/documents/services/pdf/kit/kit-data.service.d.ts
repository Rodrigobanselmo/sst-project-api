import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PdfAsoDataService } from '../aso/aso-data.service';
import { PdfProntuarioDataService } from '../prontuario/prontuario-data.service';
export declare class PdfKitDataService {
    private readonly pdfProntuarioDataService;
    private readonly pdfAsoDataService;
    constructor(pdfProntuarioDataService: PdfProntuarioDataService, pdfAsoDataService: PdfAsoDataService);
    execute(employeeId: number, userPayloadDto: UserPayloadDto, asoId?: number): Promise<{
        aso: import("../aso/types/IAsoData.type").IPdfAsoData;
        prontuario: {
            examination: import("../prontuario/types/IProntuarioData.type").IProntuarioQuestion[];
            questions: import("../prontuario/types/IProntuarioData.type").IProntuarioQuestion[];
        };
    }>;
}
