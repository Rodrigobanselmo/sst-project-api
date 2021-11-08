export interface ISendMailData {
  to: string;
  subject: string;
  variables: Record<string, unknown>;
  path: string;
}

interface IMailProvider {
  sendMail(data: ISendMailData): Promise<void>;
}

export { IMailProvider };
