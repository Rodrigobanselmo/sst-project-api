import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { UploadDocumentDto } from '../../dto/document.dto';
import { PcmsoUploadService } from '../../services/document/document/upload-pcmso-doc.service';
import { PgrUploadService } from '../../services/document/document/upload-pgr-doc.service';
import { checkInternetConnectivity } from '../../../../shared/utils/isOnline';

@Injectable()
export class PgrConsumer implements OnModuleInit {
  private app: Consumer;
  constructor(private readonly pgrUploadDocService: PgrUploadService, private readonly pcmsoUploadService: PcmsoUploadService) { }

  async onModuleInit() {
    const online = await checkInternetConnectivity();

    if (online) {
      this.app = Consumer.create({
        queueUrl: process.env.AWS_SQS_PGR_URL,
        handleMessage: (message) => this.consume(message as any),
        sqs: new AWS.SQS({ region: process.env.AWS_SQS_PGR_REGION }),
      });

      this.app.on('error', this.handleSQSError);
      this.app.on('processing_error', this.handleSQSProcessingError);
      this.app.start();
    } else {
      console.log('Skipping SQS connection. Working in offline mode.');
    }
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

  private handleSQSError = (error: Error) => {
    console.error('SQS Error:', error.message);
  };

  private handleSQSProcessingError = (error: Error) => {
    console.error('SQS Processing Error:', error.message);
  };
}
