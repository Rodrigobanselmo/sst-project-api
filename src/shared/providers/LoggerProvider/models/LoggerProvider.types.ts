export interface ILoggerProvider {
  logRequest(params: {
    method: string;
    originalUrl: string;
    ip: string;
    userAgent: string;
    body: any;
    headers: any;
  }): Promise<void>;
}
