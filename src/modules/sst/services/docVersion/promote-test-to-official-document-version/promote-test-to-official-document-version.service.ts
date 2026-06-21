import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

import {
  filterOfficialVersionsBySeries,
  isUnofficialDocumentVersion,
  validatePromoteTestToOfficial,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import {
  DocumentGenerationSnapshot,
  parseDocumentGenerationSnapshot,
} from '@/@v2/documents/domain/types/document-generation-snapshot.type';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UploadDocumentDto } from '../../../../documents/dto/document.dto';
import { DocumentDataRepository } from '../../../repositories/implementations/DocumentDataRepository';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class PromoteTestToOfficialDocumentVersionService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;

  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly documentDataRepository: DocumentDataRepository,
  ) {
    this.sqs = new SQSClient({ region: process.env.AWS_SQS_REGION });
    this.queueUrl = process.env.AWS_SQS_PGR_URL;
  }

  async execute(documentVersionId: string, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const testVersion = await this.riskDocumentRepository.findById(
      documentVersionId,
      companyId,
      { include: { documentData: true } },
    );

    if (!testVersion?.id) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (!isUnofficialDocumentVersion(testVersion.version)) {
      throw new BadRequestException(
        'Somente versões de teste podem ser convertidas em versão oficial.',
      );
    }

    if (testVersion.status === StatusEnum.PROCESSING) {
      throw new BadRequestException(
        'Esta revisão de teste está em processamento. Aguarde a conclusão antes de converter.',
      );
    }

    const documentData = await this.documentDataRepository.findById(
      testVersion.documentDataId,
      companyId,
    );

    if (!documentData) {
      throw new NotFoundException('Documento base não encontrado');
    }

    const activeOfficialSeries = documentData.officialRevisionSeries ?? 1;
    const existingVersions =
      await this.riskDocumentRepository.findByRiskGroupAndCompany(
        testVersion.documentDataId,
        companyId,
      );
    const activeOfficialVersions = filterOfficialVersionsBySeries(
      existingVersions,
      activeOfficialSeries,
    );

    const validation = validatePromoteTestToOfficial(
      testVersion.version,
      activeOfficialVersions,
    );

    if (validation.ok === false) {
      throw new BadRequestException(validation.message);
    }

    const processingOfficialCount =
      await this.riskDocumentRepository.countProcessingOfficialInSeries(
        testVersion.documentDataId,
        companyId,
        activeOfficialSeries,
      );

    if (processingOfficialCount > 0) {
      throw new BadRequestException(
        'Há versões oficiais em processamento. Aguarde a conclusão antes de converter.',
      );
    }

    const targetOfficialVersion = validation.targetOfficialVersion;
    const baseSnapshot =
      parseDocumentGenerationSnapshot(testVersion.generationSnapshot) ?? {};
    const generationSnapshot: DocumentGenerationSnapshot = {
      ...baseSnapshot,
      promotedFromTestVersionId: testVersion.id,
    };

    const validitySnapshot =
      await this.riskDocumentRepository.resolveValiditySnapshotFromDocumentData(
        testVersion.documentDataId,
        companyId,
        targetOfficialVersion,
      );

    const newOfficialVersion = await this.riskDocumentRepository.upsert({
      id: randomUUID(),
      name: testVersion.name,
      description: testVersion.description,
      documentDataId: testVersion.documentDataId,
      version: targetOfficialVersion,
      workspaceId: testVersion.workspaceId,
      workspaceName: testVersion.workspaceName,
      companyId,
      status: StatusEnum.PROCESSING,
      officialRevisionSeries: activeOfficialSeries,
      approvedBy: testVersion.approvedBy,
      elaboratedBy: testVersion.elaboratedBy,
      revisionBy: testVersion.revisionBy,
      generationSnapshot: generationSnapshot as Prisma.InputJsonValue,
      ...(testVersion.documentDate
        ? { documentDate: testVersion.documentDate.toISOString() }
        : {}),
      ...(validitySnapshot.documentCreatedAt
        ? { documentCreatedAt: validitySnapshot.documentCreatedAt }
        : {}),
      validityYears:
        'validityYears' in validitySnapshot
          ? validitySnapshot.validityYears ?? null
          : null,
      validityMonths:
        'validityMonths' in validitySnapshot
          ? validitySnapshot.validityMonths ?? null
          : null,
      validityEndSnapshot:
        'validityEndSnapshot' in validitySnapshot
          ? validitySnapshot.validityEndSnapshot ?? undefined
          : undefined,
    });

    const payload: UploadDocumentDto = {
      id: newOfficialVersion.id,
      name: newOfficialVersion.name,
      description: newOfficialVersion.description,
      version: targetOfficialVersion,
      documentDataId: newOfficialVersion.documentDataId,
      workspaceId: newOfficialVersion.workspaceId,
      workspaceName: newOfficialVersion.workspaceName,
      companyId,
      ghoIds: generationSnapshot.ghoIds,
      filterViewType: generationSnapshot.filterViewType,
      selectedFilters: generationSnapshot.selectedFilters,
      riskFilter: generationSnapshot.riskFilter,
      documentDate: testVersion.documentDate?.toISOString(),
      type: documentData.type,
      status: StatusEnum.PROCESSING,
    };

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageGroupId: 'DOCUMENT',
      MessageDeduplicationId: `${newOfficialVersion.id}-promote-${Date.now()}`,
    });

    await this.sqs.send(command);

    return newOfficialVersion;
  }
}
