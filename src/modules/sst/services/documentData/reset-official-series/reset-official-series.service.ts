import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  filterOfficialVersionsBySeries,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class ResetOfficialDocumentSeriesService {
  constructor(
    private readonly documentDataRepository: DocumentDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
  ) {}

  async execute(documentDataId: string, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const documentData = await this.documentDataRepository.findById(
      documentDataId,
      companyId,
    );

    if (!documentData) {
      throw new NotFoundException('Documento não encontrado');
    }

    const activeSeries = documentData.officialRevisionSeries ?? 1;
    const existingVersions =
      await this.riskDocumentRepository.findByRiskGroupAndCompany(
        documentDataId,
        companyId,
      );
    const activeOfficialVersions = filterOfficialVersionsBySeries(
      existingVersions,
      activeSeries,
    );

    if (activeOfficialVersions.length === 0) {
      throw new BadRequestException(
        'Não há versões oficiais na série atual para reiniciar.',
      );
    }

    const processingCount =
      await this.riskDocumentRepository.countProcessingOfficialInSeries(
        documentDataId,
        companyId,
        activeSeries,
      );

    if (processingCount > 0) {
      throw new BadRequestException(
        'Há versões oficiais em processamento na série atual. Aguarde a conclusão antes de reiniciar.',
      );
    }

    const updated = await this.documentDataRepository.incrementOfficialRevisionSeries(
      documentDataId,
      companyId,
    );

    return {
      previousOfficialRevisionSeries: activeSeries,
      officialRevisionSeries: updated.officialRevisionSeries,
    };
  }
}
