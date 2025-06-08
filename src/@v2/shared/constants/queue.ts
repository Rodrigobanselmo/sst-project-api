import { config } from './config';
import { QueueEvents } from './events';

type IQueueEvent = {
  queueName: QueueEvents;
  queueURL: string;
};
type IQueueEvents = Record<QueueEvents, IQueueEvent>;

export const QueueEventsMap: IQueueEvents = {
  [QueueEvents.GENERATE_DOCUMENT]: {
    queueName: QueueEvents.GENERATE_DOCUMENT,
    queueURL: config.AWS.SQS_PGR_URL,
  },
  [QueueEvents.SEND_EMAIL]: {
    queueName: QueueEvents.SEND_EMAIL,
    queueURL: config.AWS.SQS_EMAIL_URL,
  },
  [QueueEvents.SEND_NOTIFICATION]: {
    queueName: QueueEvents.SEND_NOTIFICATION,
    queueURL: config.AWS.SQS_NOTIFICATION_URL,
  },
} as const;
