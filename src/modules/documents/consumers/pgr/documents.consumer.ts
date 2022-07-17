import { MessageSQS } from './../../../../shared/interfaces/message-sqs';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { UpsertPgrDto } from '../../dto/pgr.dto';
import { PgrUploadService } from '../../services/pgr/document/upload-pgr-doc.service';

@Injectable()
export class SendSMSConsumer {
  constructor(private readonly pgrUploadDocService: PgrUploadService) {
    Consumer.create({
      queueUrl: process.env.AWS_SQS_PGR_URL,
      handleMessage: (message) => this.consume(message as any),
      sqs: new AWS.SQS({ region: process.env.AWS_SQS_PGR_REGION }),
    }).start();
  }

  private async consume(message: MessageSQS): Promise<void> {
    const body: UpsertPgrDto = JSON.parse(message.Body);

    await this.pgrUploadDocService.execute({
      ...body,
    });
  }
}
