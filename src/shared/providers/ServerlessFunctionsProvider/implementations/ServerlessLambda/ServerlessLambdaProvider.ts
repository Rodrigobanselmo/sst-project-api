import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import {
  ICreateDocumentProps,
  ICreateDocumentFuncReturn,
  ICreateDocumentReturn,
} from '../../models/ServerlessFunctionsProvider.types';

export class ServerlessLambdaProvider {
  private readonly lambda: LambdaClient;

  constructor() {
    this.lambda = new LambdaClient({
      region: process.env.AWS_LAMBDA_REGION,
      ...(process.env.APP_HOST.includes('localhost') && {
        endpoint: 'http://localhost:3002',
        apiVersion: '2015-03-31',
      }),
    });
  }

  async createDocument(data: ICreateDocumentProps): Promise<ICreateDocumentReturn> {
    // if (process.env.APP_HOST.includes('localhost')) return { url: 'edwq' };

    try {
      const command = new InvokeCommand({
        FunctionName: 'sst-project-lambda-dev-createDocument',
        Payload: JSON.stringify(data),
      });

      const response = await this.lambda.send(command);

      const payload = JSON.parse(response.Payload?.transformToString('utf-8')) as ICreateDocumentFuncReturn;

      console.log('Lambda response:', payload);

      // return { url: payload.url };
      return { url: null };
    } catch (error) {
      console.error('Error invoking Lambda:', error);
      return { url: null };
    }
  }
}
