import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { Producer as LibSQSProducer } from 'sqs-producer';
import { SQS } from '@aws-sdk/client-sqs';

import { Producer } from './producer.interface';
import { QueueEvents } from '@/@v2/shared/constants/events';
import { QueueEventsMap } from '@/@v2/shared/constants/queue';
import { config } from '@/@v2/shared/constants/config';

@Injectable()
export class SQSProducer<T> implements Producer<T> {
  constructor() {}

  async produce(event: QueueEvents, message: T, options?: { groupId?: string }): Promise<void> {
    await LibSQSProducer.create({
      sqs: new SQS({ region: config.AWS.AWS_SQS_REGION }),
      queueUrl: QueueEventsMap[event].queueURL,
    }).send({
      id: randomUUID(),
      body: JSON.stringify(message),
      groupId: options?.groupId,
      deduplicationId: options?.groupId ? randomUUID() : undefined,
    });
  }
}
