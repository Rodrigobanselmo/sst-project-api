export interface Queue<T = any> {
  consume(message: T): Promise<void>;
}
