import { Injectable } from "@nestjs/common";
import { StatusEnum } from "@prisma/client";

import { UserPayloadDto } from "../../../../../shared/dto/user-payload.dto";
import { RiskDocumentRepository } from "../../../../sst/repositories/implementations/RiskDocumentRepository";
import { UploadDocumentDto } from "../../../dto/document.dto";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

@Injectable()
export class AddQueueDocumentService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;

  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {
    this.sqs = new SQSClient({ region: process.env.AWS_SQS_PGR_REGION });
    this.queueUrl = process.env.AWS_SQS_PGR_URL;
  }
  async execute(
    upsertPgrDto: UploadDocumentDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    const riskDoc = await this.riskDocumentRepository.upsert({
      id: upsertPgrDto.id,
      name: upsertPgrDto.name,
      documentDataId: upsertPgrDto.documentDataId,
      version: upsertPgrDto.version,
      workspaceId: upsertPgrDto.workspaceId,
      workspaceName: upsertPgrDto.workspaceName,
      companyId,
      status: upsertPgrDto.status || StatusEnum.PROCESSING,
    });

    const payload: UploadDocumentDto = {
      ...upsertPgrDto,
      id: riskDoc.id,
    };

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageGroupId: "DOCUMENT",
      MessageDeduplicationId: riskDoc.id,
    });

    await this.sqs.send(command);

    return riskDoc;
  }
}
