import { Events } from "@/@v2/shared/constants/events";

export interface Producer<T = any> {
  produce(queue: Events, message: T): Promise<void>
}
