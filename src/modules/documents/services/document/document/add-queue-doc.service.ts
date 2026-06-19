import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UploadDocumentDto } from '../../../dto/document.dto';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { StatusEnum } from '@prisma/client';
import { isOfficialDocumentVersion } from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { logPgrDiagnostic } from '../../../../../shared/utils/pgr-diagnostic-log.util';

@Injectable()
export class AddQueueDocumentService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;

  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {
    this.sqs = new SQSClient({ region: process.env.AWS_SQS_REGION });
    this.queueUrl = process.env.AWS_SQS_PGR_URL;
  }
  async execute(upsertPgrDto: UploadDocumentDto, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;

    const [officialRevisionSeries, revisionSnapshot, validitySnapshot] =
      await Promise.all([
      this.riskDocumentRepository.resolveOfficialRevisionSeriesForVersion(
        upsertPgrDto.documentDataId,
        companyId,
        upsertPgrDto.version,
      ),
      this.riskDocumentRepository.resolveRevisionSnapshotFromDocumentData(
        upsertPgrDto.documentDataId,
        companyId,
      ),
      this.riskDocumentRepository.resolveValiditySnapshotFromDocumentData(
        upsertPgrDto.documentDataId,
        companyId,
        upsertPgrDto.version,
      ),
    ]);

    const riskDoc = await this.riskDocumentRepository.upsert({
      id: upsertPgrDto.id,
      name: upsertPgrDto.name,
      description: upsertPgrDto.description,
      documentDataId: upsertPgrDto.documentDataId,
      version: upsertPgrDto.version,
      workspaceId: upsertPgrDto.workspaceId,
      workspaceName: upsertPgrDto.workspaceName,
      companyId,
      status: upsertPgrDto.status || StatusEnum.PROCESSING,
      officialRevisionSeries,
      approvedBy: revisionSnapshot?.approvedBy ?? null,
      revisionBy: revisionSnapshot?.revisionBy ?? null,
      elaboratedBy: revisionSnapshot?.elaboratedBy ?? null,
      ...(upsertPgrDto.documentDate
        ? { documentDate: upsertPgrDto.documentDate }
        : {}),
      ...(validitySnapshot.documentCreatedAt
        ? { documentCreatedAt: validitySnapshot.documentCreatedAt }
        : {}),
      ...(isOfficialDocumentVersion(upsertPgrDto.version)
        ? {
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
                ? validitySnapshot.validityEndSnapshot ?? null
                : null,
          }
        : {}),
    });

    const payload: UploadDocumentDto = {
      ...upsertPgrDto,
      id: riskDoc.id,
    };

    logPgrDiagnostic('http_enqueue', {
      endpoint: 'POST /documents/base/add-queue/pgr',
      documentVersionId: riskDoc.id,
      queueUrl: this.queueUrl,
      ghoIdsCount: payload.ghoIds?.length ?? 0,
      ghoIds: payload.ghoIds ?? [],
      companyId,
      workspaceId: payload.workspaceId,
      documentDataId: payload.documentDataId,
    });

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageGroupId: 'DOCUMENT',
      MessageDeduplicationId: riskDoc.id,
    });

    await this.sqs.send(command);

    return riskDoc;
  }
}
