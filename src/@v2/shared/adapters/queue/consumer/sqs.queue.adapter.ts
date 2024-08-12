import { Logger, OnModuleInit } from '@nestjs/common'
import { Consumer as LibSQSConsumer } from 'sqs-consumer'
import { SQS } from '@aws-sdk/client-sqs'


import { Queue } from './queue.interface'
import { validateDto } from '@/@v2/shared/utils/helpers/validate-dto'
import { Events } from '@/@v2/shared/constants/events'
import { QueueEvents } from '@/@v2/shared/constants/queue'

export function MessageBody() {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingRequiredParameters: number[] = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey) || []
    existingRequiredParameters.push(parameterIndex)
    Reflect.defineMetadata('design:paramtypes', existingRequiredParameters, target, propertyKey)
  }
}

export function Consumer(eventName: Events) {
  return function <T extends { new(...args: any[]): Queue }>(constructor: T) {
    return class extends constructor implements OnModuleInit {
      eventName = eventName
      readonly logger = new Logger(constructor.name)

      async onModuleInit() {
        if (!this.eventName) {
          throw new Error('@EventListener() decorator is required')
        }

        const paramTypes = Reflect.getMetadata('design:paramtypes', this, 'consume')
        const consumeMessageType = paramTypes ? paramTypes[0] : null

        const app = LibSQSConsumer.create({
          sqs: new SQS({ endpoint: process.env.AWS_ENDPOINT }),
          queueUrl: QueueEvents[this.eventName].queueURL,
          handleMessage: async (message) => {
            let params: any = message

            if (consumeMessageType && message.Body) {
              const [body, error] = await validateDto(JSON.parse(message.Body), consumeMessageType)
              if (error) throw new Error(error)
              params = body
            }

            return this.consume(params)
          }
        })

        app.on('error', this.handleSQSError)
        app.on('processing_error', this.handleSQSProcessingError)
        app.on('message_received', () => this.logger.log('Message received'))
        app.start()
      }

      public handleSQSError = (error: Error) => {
        //! captureException(error)
        this.logger.error(`SQS Error:[${eventName}]`, error.stack)
      }

      public handleSQSProcessingError = (error: Error) => {
        //! captureException(error)
        this.logger.error(`SQS Processing Error:[${eventName}]`, error.stack)
      }
    }
  }
}
