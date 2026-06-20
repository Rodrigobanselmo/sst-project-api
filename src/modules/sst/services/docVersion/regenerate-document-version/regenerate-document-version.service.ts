import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import {
  buildDocumentGenerationSnapshot,
  DocumentGenerationSnapshot,
} from '@/@v2/documents/domain/types/document-generation-snapshot.type';
import { parseDocumentGenerationRiskFilter } from '@/@v2/documents/domain/types/document-generation-risk-filter.type';
import { isUnofficialDocumentVersion } from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UploadDocumentDto } from '../../../../documents/dto/document.dto';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';
import { RegenerateDocumentVersionDto } from '../../../dto/regenerate-document-version.dto';

@Injectable()
export class RegenerateDocumentVersionService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;

  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly documentDataRepository: DocumentDataRepository,
  ) {
    this.sqs = new SQSClient({ region: process.env.AWS_SQS_REGION });
    this.queueUrl = process.env.AWS_SQS_PGR_URL;
  }

  async execute(
    documentVersionId: string,
    body: RegenerateDocumentVersionDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    const existing = await this.riskDocumentRepository.findById(
      documentVersionId,
      companyId,
      { include: { documentData: true } },
    );

    if (!existing) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (!isUnofficialDocumentVersion(existing.version)) {
      throw new BadRequestException(
        'Somente versões de teste podem ser editadas e regeradas nesta fase.',
      );
    }

    if (existing.status === StatusEnum.PROCESSING) {
      throw new BadRequestException(
        'Esta revisão está em processamento. Aguarde a conclusão antes de regerar.',
      );
    }

    const documentData = await this.documentDataRepository.findById(
      existing.documentDataId,
      companyId,
    );

    if (!documentData) {
      throw new NotFoundException('Documento base não encontrado');
    }

    const generationSnapshot = this.buildSnapshotFromBody(body);

    await this.riskDocumentRepository.deleteAttachmentsByDocumentVersionId(
      documentVersionId,
    );

    const updated = await this.riskDocumentRepository.updateForRegeneration({
      id: documentVersionId,
      companyId,
      name: body.name,
      description: body.description ?? existing.description,
      documentDate: body.documentDate,
      approvedBy: body.approvedBy ?? null,
      elaboratedBy: body.elaboratedBy ?? null,
      revisionBy: body.revisionBy ?? null,
      generationSnapshot: generationSnapshot as Prisma.InputJsonValue,
    });

    const payload: UploadDocumentDto = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      version: updated.version,
      documentDataId: updated.documentDataId,
      workspaceId: updated.workspaceId,
      workspaceName: updated.workspaceName,
      companyId,
      ghoIds: generationSnapshot.ghoIds,
      filterViewType: generationSnapshot.filterViewType,
      riskFilter: generationSnapshot.riskFilter,
      documentDate: body.documentDate,
      type: documentData.type,
      status: StatusEnum.PROCESSING,
    };

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageGroupId: 'DOCUMENT',
      MessageDeduplicationId: `${updated.id}-regenerate-${Date.now()}`,
    });

    await this.sqs.send(command);

    return updated;
  }

  async buildSnapshotFromDocumentData(
    documentDataId: string,
    companyId: string,
    params: {
      ghoIds?: string[];
      filterViewType?: string;
      selectedFilters?: Array<{ id: string; name?: string }>;
      riskFilter?: RegenerateDocumentVersionDto['riskFilter'];
    },
  ): Promise<DocumentGenerationSnapshot> {
    const documentData = await this.documentDataRepository.findByIdForGenerationSnapshot(
      documentDataId,
      companyId,
    );

    if (!documentData) {
      return buildDocumentGenerationSnapshot(params);
    }

    return buildDocumentGenerationSnapshot({
      ghoIds: params.ghoIds,
      filterViewType: params.filterViewType,
      selectedFilters: params.selectedFilters,
      riskFilter: parseDocumentGenerationRiskFilter(params.riskFilter),
      modelId: documentData.modelId,
      coordinatorBy: documentData.coordinatorBy,
      legalResponsibleBy: this.extractLegalResponsibleBy(documentData.json),
      json: documentData.json as Prisma.JsonValue | undefined,
      professionalSignatures: documentData.professionalsSignatures?.map(
        (signature) => ({
          professionalId: signature.professionalId,
          isSigner: signature.isSigner,
          isElaborator: signature.isElaborator,
        }),
      ),
    });
  }

  private buildSnapshotFromBody(
    body: RegenerateDocumentVersionDto,
  ): DocumentGenerationSnapshot {
    return buildDocumentGenerationSnapshot({
      ghoIds: body.ghoIds,
      filterViewType: body.filterViewType,
      selectedFilters: body.selectedFilters,
      riskFilter: parseDocumentGenerationRiskFilter(body.riskFilter),
      modelId: body.modelId,
      coordinatorBy: body.coordinatorBy,
      legalResponsibleBy: body.legalResponsibleBy,
      json: body.json as Prisma.JsonValue | undefined,
      professionalSignatures: body.professionalSignatures,
    });
  }

  private extractLegalResponsibleBy(json: unknown): string | undefined {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
      return undefined;
    }

    const value = (json as Record<string, unknown>).legalResponsibleBy;
    return typeof value === 'string' && value.trim() ? value : undefined;
  }
}
