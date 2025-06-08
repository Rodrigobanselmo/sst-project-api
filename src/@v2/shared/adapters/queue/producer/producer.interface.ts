import { QueueEvents } from '@/@v2/shared/constants/events';

export interface Producer<T = any> {
  produce(queue: QueueEvents, message: T, options?: { groupId?: string }): Promise<void>;
}
