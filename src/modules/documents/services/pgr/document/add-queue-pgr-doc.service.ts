import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import AWS from 'aws-sdk';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { UpsertPgrDto } from '../../../dto/pgr.dto';

@Injectable()
export class AddQueuePGRDocumentService {
  private readonly sqs: AWS.SQS;
  private readonly queueUrl: string;

  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {
    this.sqs = new AWS.SQS({ region: process.env.AWS_SQS_PGR_REGION });
    this.queueUrl = process.env.AWS_SQS_PGR_URL;
  }
  async execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;

    const riskDoc = await this.riskDocumentRepository.upsert({
      ...upsertPgrDto,
      companyId,
      status: StatusEnum.PROCESSING,
    });

    const payload: UpsertPgrDto = {
      ...upsertPgrDto,
      id: riskDoc.id,
    };

    await this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(payload),
        MessageGroupId: 'PGR',
        MessageDeduplicationId: riskDoc.id,
      })
      .promise();

    return riskDoc;
  }
}
