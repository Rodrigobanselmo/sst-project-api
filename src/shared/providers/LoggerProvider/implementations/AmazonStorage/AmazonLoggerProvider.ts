import { PutLogEventsCommand, CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';

import { ILoggerProvider } from '../../models/LoggerProvider.types';
import { HashProvider } from '../../../../providers/HashProvider/implementations/HashProvider';
import { IHashProvider } from '../../../../providers/HashProvider/models/IHashProvider.types';

export class AmazonLoggerProvider implements ILoggerProvider {
  private readonly cloudwatchClient: CloudWatchLogsClient;
  private readonly hashProvider: HashProvider;

  constructor() {
    this.cloudwatchClient = new CloudWatchLogsClient({ region: process.env.CLOUDWATCH_AWS_REGION });
    this.hashProvider = new HashProvider();
  }

  async logRequest({ is404NoUSer, ...data }: any) {
    if (is404NoUSer) this.log404(data);
    else
      this.log({
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: process.env.CLOUDWATCH_LOG_NAME,
        data,
      });
  }

  async logError(data: any) {
    this.log({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_ERROR_LOG_NAME || 'api-errors',
      data,
    });
  }

  async log404(data: any) {
    this.log({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME_404 || '30-days-retention',
      logStreamName: process.env.CLOUDWATCH_ERROR_LOG_NAME || 'api-request-404',
      data,
    });
  }

  async log({ logGroupName, logStreamName, data }: { logGroupName: string; logStreamName: string; data: any }) {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const message = JSON.stringify({ ...data });
    const maxSize = 262144; // 256 KB
    const truncatedMessage = this.truncateMessageToSize(message, maxSize);

    try {
      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [
          {
            message: truncatedMessage,
            timestamp: new Date().getTime(),
          },
        ],
      });
      await this.cloudwatchClient.send(command);
    } catch (error) {
      console.error('Error sending error log events:', error);

      const message = JSON.stringify(error);
      const truncatedMessage = this.truncateMessageToSize(message);

      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [
          {
            message: truncatedMessage,
            timestamp: new Date().getTime(),
          },
        ],
      });

      await this.cloudwatchClient.send(command);
    }
  }

  private truncateMessageToSize(message: string, maxSize = 250000): string {
    // Calculate the max message size considering other fields
    const overhead = 1024; // Approximate overhead for additional JSON fields and metadata
    const maxMessageSize = maxSize - overhead;

    if (message.length > maxMessageSize) {
      return message.substring(0, maxMessageSize);
    }

    return message;
  }
}
