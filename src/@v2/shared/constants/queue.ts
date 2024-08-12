import { config } from './config';
import { Events } from './events'

type IQueueEvent = {
  queueName: Events
  queueURL: string
}
type IQueueEvents = Record<Events, IQueueEvent>

export const QueueEvents: IQueueEvents = {
  [Events.GENERATE_DOCUMENT]: {
    queueName: Events.GENERATE_DOCUMENT,
    queueURL: config.AWS.SQS_PGR_URL
  },
} as const
