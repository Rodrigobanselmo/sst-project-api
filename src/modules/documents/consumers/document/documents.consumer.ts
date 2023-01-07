import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { UpsertDocumentDto } from '../../dto/pgr.dto';
import { PgrUploadService } from '../../services/pgr/document/upload-pgr-doc.service';
import { PcmsoUploadService } from '../../services/pgr/document/upload-pcmso-doc.service';

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
    const body: UpsertDocumentDto = JSON.parse(message.Body);

    try {
      if (body.isPGR) {
        delete body.isPGR;
        await this.pgrUploadDocService.execute({
          ...body,
        });
      }
      if (body.isPCMSO) {
        delete body.isPCMSO;
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
