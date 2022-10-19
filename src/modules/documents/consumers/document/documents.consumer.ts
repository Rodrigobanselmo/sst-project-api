import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { UpsertDocumentDto } from '../../dto/pgr.dto';
import { PgrUploadService } from '../../services/pgr/document/upload-pgr-doc.service';
import { PcmsoUploadService } from '../../services/pgr/document/upload-pcmso-doc.service';

@Injectable()
export class PgrConsumer {
  constructor(
    private readonly pgrUploadDocService: PgrUploadService,
    private readonly pcmsoUploadService: PcmsoUploadService,
  ) {
    Consumer.create({
      queueUrl: process.env.AWS_SQS_PGR_URL,
      handleMessage: (message) => this.consume(message as any),
      sqs: new AWS.SQS({ region: process.env.AWS_SQS_PGR_REGION }),
    }).start();
  }

  private async consume(message: MessageSQS): Promise<void> {
    const body: UpsertDocumentDto = JSON.parse(message.Body);

    try {
      if (body.isPGR)
        await this.pgrUploadDocService.execute({
          ...body,
        });
      if (body.isPCMSO)
        await this.pcmsoUploadService.execute({
          ...body,
        });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
