export type MessageSQS<T = string> = {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: T;
};
