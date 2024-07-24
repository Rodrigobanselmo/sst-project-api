import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { MessageSQS } from '../../../../shared/interfaces/message-sqs';
import { checkInternetConnectivity } from '../../../../shared/utils/isOnline';
import { EC2Client, StartInstancesCommand } from '@aws-sdk/client-ec2';

@Injectable()
export class TriggerPgrConsumer implements OnModuleInit {
  private app: Consumer;
  private ec2: EC2Client;
  private sqs: SQSClient;

  constructor() {
    this.ec2 = new EC2Client({ region: process.env.AWS_EC2_REGION });
    this.sqs = new SQSClient({ region: process.env.AWS_SQS_PGR_REGION });
  }

  async onModuleInit() {
    const online = await checkInternetConnectivity();

    if (online) {
      this.app = Consumer.create({
        queueUrl: process.env.AWS_SQS_TRIGGER_PGR_URL,
        handleMessage: (message) => this.consume(message as any),
        sqs: this.sqs,
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
    try {
      await this.launchInstance();
      await this.forwardMessage(message);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async launchInstance() {
    const command = new StartInstancesCommand({ InstanceIds: [process.env.PGR_INSTANCE_ID] });
    await this.ec2.send(command);
  }

  private async forwardMessage(message: MessageSQS) {
    const command = new SendMessageCommand({
      QueueUrl: process.env.AWS_SQS_PGR_URL,
      MessageBody: message.Body,
      MessageGroupId: 'DOCUMENT',
      MessageDeduplicationId: message.MessageId,
    });

    await this.sqs.send(command);
  }

  private handleSQSError = (error: Error) => {
    console.error('SQS Error:', error.message);
  };

  private handleSQSProcessingError = (error: Error) => {
    console.error('SQS Processing Error:', error.message);
  };
}
