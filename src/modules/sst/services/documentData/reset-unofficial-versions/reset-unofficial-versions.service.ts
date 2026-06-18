import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';
import {
  filterUnofficialVersions,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';

@Injectable()
export class ResetUnofficialDocumentVersionsService {
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

    const processingCount =
      await this.riskDocumentRepository.countProcessingUnofficial(
        documentDataId,
        companyId,
      );

    if (processingCount > 0) {
      throw new BadRequestException(
        'Há versões de teste em processamento. Aguarde a conclusão antes de reiniciar.',
      );
    }

    const existingVersions =
      await this.riskDocumentRepository.findByRiskGroupAndCompany(
        documentDataId,
        companyId,
      );
    const unofficialCount = filterUnofficialVersions(existingVersions).length;

    if (unofficialCount === 0) {
      throw new BadRequestException(
        'Não há versões de teste para reiniciar.',
      );
    }

    const deletedCount =
      await this.riskDocumentRepository.deleteUnofficialByDocumentDataId(
        documentDataId,
        companyId,
      );

    return { deletedCount };
  }
}
