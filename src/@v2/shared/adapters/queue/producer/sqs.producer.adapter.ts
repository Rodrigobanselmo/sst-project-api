import { randomUUID } from 'crypto'

import { Injectable } from '@nestjs/common'
import { Producer as LibSQSProducer } from 'sqs-producer'
import { SQS } from '@aws-sdk/client-sqs'


import { Producer } from './producer.interface'
import { Events } from '@/@v2/shared/constants/events'
import { QueueEvents } from '@/@v2/shared/constants/queue'

@Injectable()
export class SQSProducer<T> implements Producer<T> {
  constructor() { }

  async produce(event: Events, message: T): Promise<void> {
    await LibSQSProducer.create({
      sqs: new SQS({ endpoint: process.env.AWS_ENDPOINT }),
      queueUrl: QueueEvents[event].queueURL
    }).send({
      id: randomUUID(),
      body: JSON.stringify(message)
    })
  }
}
