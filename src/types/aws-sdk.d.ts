/**
 * Declarações mínimas para pacotes @aws-sdk quando os tipos embutidos
 * não são resolvidos (ex.: dist-types/index.d.ts ausente em algumas instalações).
 * O runtime usa os pacotes instalados em node_modules.
 */

declare module '@aws-sdk/client-s3' {
  export class S3Client {
    constructor(config?: any);
    send(command: any): Promise<any>;
  }
  export class PutObjectCommand {
    constructor(params?: any);
  }
  export class GetObjectCommand {
    constructor(params?: any);
  }
  export class DeleteObjectCommand {
    constructor(params?: any);
  }
}

declare module '@aws-sdk/client-sqs' {
  export class SQSClient {
    constructor(config?: any);
    send(command: any): Promise<any>;
  }
  export class SQS extends SQSClient {}
  export class SendMessageCommand {
    constructor(params?: any);
  }
}

declare module '@aws-sdk/client-ses' {
  export class SESClient {
    constructor(config?: any);
    send(command: any): Promise<any>;
  }
  export class SendEmailCommand {
    constructor(params?: any);
  }
  export class SendRawEmailCommand {
    constructor(params?: any);
  }
}

declare module '@aws-sdk/client-cloudwatch-logs' {
  export class CloudWatchLogsClient {
    constructor(config?: any);
    send(command: any): Promise<any>;
  }
  export class PutLogEventsCommand {
    constructor(params?: any);
  }
}

declare module '@aws-sdk/client-lambda' {
  export class LambdaClient {
    constructor(config?: any);
    send(command: any): Promise<any>;
  }
  export class InvokeCommand {
    constructor(params?: any);
  }
}

declare module '@aws-sdk/s3-request-presigner' {
  export function getSignedUrl(client: any, command: any, options?: { expiresIn?: number }): Promise<string>;
}
