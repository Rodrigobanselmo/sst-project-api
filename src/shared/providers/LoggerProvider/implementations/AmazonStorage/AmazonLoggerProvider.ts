import { PutLogEventsCommand, CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

import { ILoggerProvider } from '../../models/LoggerProvider.types';
import { HashProvider } from "../../../../providers/HashProvider/implementations/HashProvider";
import { IHashProvider } from "../../../../providers/HashProvider/models/IHashProvider.types";

export class AmazonLoggerProvider implements ILoggerProvider {
  private readonly cloudwatchClient: CloudWatchLogsClient;
  private readonly hashProvider: HashProvider;

  constructor() {
    this.cloudwatchClient = new CloudWatchLogsClient({ region: process.env.CLOUDWATCH_AWS_REGION });
    this.hashProvider = new HashProvider();
  }

  async logRequest(data: any) {
    this.log({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_LOG_NAME || 'api-errors',
      data,
    })
  }

  async logError(data: any) {
    this.log({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_ERROR_LOG_NAME || 'api-errors',
      data,
    })
  }

  private async log({ logGroupName, logStreamName, data }: { logGroupName: string, logStreamName: string, data: any }) {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [{
          message: JSON.stringify({
            ...data,
          }),
          timestamp: new Date().getTime(),
        }],
      });
      await this.cloudwatchClient.send(command);
    } catch (error) {
      console.error("Error sending error log events:", error);

      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [{
          message: JSON.stringify(error),
          timestamp: new Date().getTime(),
        }],
      });

      await this.cloudwatchClient.send(command);
    }
  }


}