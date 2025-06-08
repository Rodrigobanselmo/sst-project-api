import { SQSClient } from '@aws-sdk/client-sqs';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Consumer as LibSQSConsumer } from 'sqs-consumer';

import { QueueEvents } from '@/@v2/shared/constants/events';
import { QueueEventsMap } from '@/@v2/shared/constants/queue';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { checkInternetConnectivity } from '@/@v2/shared/utils/helpers/check-internet-connectivity';
import { Queue } from './queue.interface';

export function Consumer(eventName: QueueEvents) {
  return function <T extends { new (...args: any[]): Queue }>(constructor: T) {
    return class extends constructor implements OnModuleInit {
      eventName = eventName;
      readonly logger = new Logger(constructor.name);

      async onModuleInit() {
        const online = await checkInternetConnectivity();
        if (!online) return console.log('Skipping SQS connection. Working in offline mode.');

        if (!this.eventName) throw new Error('@EventListener() decorator is required');

        const app = LibSQSConsumer.create({
          sqs: new SQSClient({ region: process.env.AWS_SQS_REGION }),
          queueUrl: QueueEventsMap[this.eventName].queueURL,
          handleMessage: async (message) => {
            let params: any = message;

            if (message.Body) {
              params = JSON.parse(message.Body);
            }

            return this.consume(params);
          },
        });

        app.on('error', this.handleSQSError);
        app.on('processing_error', this.handleSQSProcessingError);
        app.on('message_received', () => this.logger.log(`SQS Message Received:[${eventName}]`));
        app.on('message_processed', () => this.logger.log(`SQS Message Processed successfully:[${eventName}]`));
        app.start();
      }

      public handleSQSError = (error: Error) => {
        captureException(error);
        this.logger.error(`SQS Error:[${eventName}]`, error.stack);
      };

      public handleSQSProcessingError = (error: Error) => {
        captureException(error);
        this.logger.error(`SQS Processing Error:[${eventName}]`, error.stack);
      };
    };
  };
}
