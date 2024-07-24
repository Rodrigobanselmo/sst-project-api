import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import { Consumer } from 'sqs-consumer';
import { SQSClient } from '@aws-sdk/client-sqs';

import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { UploadDocumentDto } from '../../dto/document.dto';
import { PcmsoUploadService } from '../../services/document/document/upload-pcmso-doc.service';
import { PgrUploadService } from '../../services/document/document/upload-pgr-doc.service';
import { checkInternetConnectivity } from '../../../../shared/utils/isOnline';
import { EC2Client, StopInstancesCommand } from '@aws-sdk/client-ec2';

@Injectable()
export class PgrConsumer implements OnModuleInit {
  private app: Consumer;
  private isDocumentInstance: boolean;
  private ec2: EC2Client;

  constructor(
    private readonly pgrUploadDocService: PgrUploadService,
    private readonly pcmsoUploadService: PcmsoUploadService,
  ) {
    this.isDocumentInstance = process.env.DOCUMENT_INSTANCE === 'true';
    this.ec2 = new EC2Client({ region: process.env.AWS_EC2_REGION });
  }

  async onModuleInit() {
    if (!this.isDocumentInstance) return;

    const online = await checkInternetConnectivity();

    if (online) {
      this.app = Consumer.create({
        queueUrl: process.env.AWS_SQS_PGR_URL,
        handleMessage: (message) => this.consume(message as any),
        batchSize: 5,
        sqs: new SQSClient({ region: process.env.AWS_SQS_PGR_REGION }),
      });

      this.app.on('error', this.handleSQSError);
      this.app.on('processing_error', this.handleSQSProcessingError);
      this.app.on('message_received', () => console.log('Message received'));
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
    } finally {
      await this.stopInstance();
    }
  }

  private async stopInstance() {
    const command = new StopInstancesCommand({ InstanceIds: [process.env.PGR_INSTANCE_ID] });
    await this.ec2.send(command);
  }

  private handleSQSError = (error: Error) => {
    console.error('SQS Error:', error.message);
  };

  private handleSQSProcessingError = (error: Error) => {
    console.error('SQS Processing Error:', error.message);
  };
}
