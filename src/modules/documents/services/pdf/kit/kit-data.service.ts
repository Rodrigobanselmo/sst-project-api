import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PdfAsoDataService } from '../aso/aso-data.service';
import { PdfProntuarioDataService } from '../prontuario/prontuario-data.service';

@Injectable()
export class PdfKitDataService {
  constructor(private readonly pdfProntuarioDataService: PdfProntuarioDataService, private readonly pdfAsoDataService: PdfAsoDataService) {}
  async execute(employeeId: number, userPayloadDto: UserPayloadDto, asoId?: number) {
    const companyId = userPayloadDto.targetCompanyId;

    const aso = await this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId);
    const examination = await this.pdfProntuarioDataService.getExamination(aso.employee, companyId);
    const questions = await this.pdfProntuarioDataService.getQuestions(aso.employee, companyId);

    return {
      aso,
      prontuario: {
        examination,
        questions,
      },
    };
  }
}
