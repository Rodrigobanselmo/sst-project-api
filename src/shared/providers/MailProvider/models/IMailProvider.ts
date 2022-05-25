export interface ISendMailData {
  to: string;
  subject: string;
  variables: Record<string, unknown>;
  path: string;
  source?: string;
}

interface IMailProvider {
  sendMail(data: ISendMailData): Promise<void>;
}

export { IMailProvider };
