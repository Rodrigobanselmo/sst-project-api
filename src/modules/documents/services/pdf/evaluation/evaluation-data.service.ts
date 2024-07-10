import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HierarchyEntity } from '../../../../company/entities/hierarchy.entity';
import { FindAllRiskDataByEmployeeService } from '../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { PdfProntuarioDataService } from '../prontuario/prontuario-data.service';
import { IEvaluationQuestion, IPdfEvaluationData } from './types/IEvaluationData.type';

@Injectable()
export class PdfEvaluationDataService {
  constructor(
    private readonly pdfProntuarioDataService: PdfProntuarioDataService,
    private readonly findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService,
  ) {}
  async execute(employeeId: number, userPayloadDto: UserPayloadDto): Promise<IPdfEvaluationData> {
    const prontuario = await this.pdfProntuarioDataService.execute(employeeId, userPayloadDto, { isAvaliation: true });
    const questions = await this.getQuestions();

    return { ...prontuario, questions };
  }

  async getQuestions() {
    const questions: IEvaluationQuestion[] = [
      { name: 'Exame físico', textAnswer: '' },
      { name: 'Motivo da avaliação/Queixa duração', textAnswer: '' },
      { name: 'Apresentou afastamento/atestados', textAnswer: '' },
      { name: 'Ficou afastado pelo INSS', textAnswer: '' },
    ];

    return questions;
  }

  onGetSector(hierarchy: Partial<HierarchyEntity>) {
    return hierarchy?.parents?.find((parent) => parent.type == 'SECTOR');
    // this.hierarchyRepository.findFirstNude({where:{type:'SECTOR', children:{some:{}}}})
  }
}
