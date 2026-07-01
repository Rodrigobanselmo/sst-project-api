import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';

import { ExamTechnicalSuggestionQuery } from './exam-technical-suggestion.dto';
import { ExamTechnicalSuggestionService } from './exam-technical-suggestion.service';

@Controller(MedicineRoutes.EXAMS.TECHNICAL_SUGGESTION.BASE)
@UseGuards(JwtAuthGuard)
export class ExamTechnicalSuggestionController {
  constructor(private readonly service: ExamTechnicalSuggestionService) {}

  @Get(MedicineRoutes.EXAMS.TECHNICAL_SUGGESTION.SUGGEST)
  suggest(@Query() query: ExamTechnicalSuggestionQuery) {
    return this.service.getSuggestion({
      companyId: query.companyId,
      riskFactorId: query.riskFactorId,
      examId: query.examId,
    });
  }
}
