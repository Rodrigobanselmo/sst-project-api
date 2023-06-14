import { PutLogEventsCommand, CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

import { ILoggerProvider } from '../../models/LoggerProvider.types';

export class AmazonLoggerProvider implements ILoggerProvider {
  private readonly cloudwatchClient: CloudWatchLogsClient;

  constructor() {
    this.cloudwatchClient = new CloudWatchLogsClient({ region: process.env.CLOUDWATCH_AWS_REGION });
  }

  async logRequest(data: any) {
    try {
      const command = new PutLogEventsCommand({
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: process.env.CLOUDWATCH_LOG_NAME,
        logEvents: [{
          message: JSON.stringify({
            ...data,
          }),
          timestamp: new Date().getTime(),
        }],
      });
      await this.cloudwatchClient.send(command);
    } catch (error) {
      console.error("Error sending log events:", error);
    }
  }
}