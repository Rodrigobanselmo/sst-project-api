import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { UploadDocumentDto } from '../../dto/document.dto';
import { PcmsoUploadService } from '../../services/document/document/upload-pcmso-doc.service';
import { PgrUploadService } from '../../services/document/document/upload-pgr-doc.service';

@Injectable()
export class PgrConsumer {
  constructor(private readonly pgrUploadDocService: PgrUploadService, private readonly pcmsoUploadService: PcmsoUploadService) {
    const listener = (type: string) => (error) => console.error(`error: ${type}`, error?.message);

    const app = Consumer.create({
      queueUrl: process.env.AWS_SQS_PGR_URL,
      handleMessage: (message) => this.consume(message as any),
      sqs: new AWS.SQS({ region: process.env.AWS_SQS_PGR_REGION }),
    });

    app.on('error', listener('SQS_ERROR'));
    app.on('processing_error', listener('SQS_PROCESSING_ERROR'));
    app.start();
  }

  private async consume(message: MessageSQS): Promise<void> {
    const body: UploadDocumentDto = JSON.parse(message.Body);

    try {
      if (body.type == DocumentTypeEnum.PGR) {
        await this.pgrUploadDocService.execute({
          ...body,
        });
      }
      if (body.type == DocumentTypeEnum.PCSMO) {
        await this.pcmsoUploadService.execute({
          ...body,
        });
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
