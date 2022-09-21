export interface ISendMailAttachmentData {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
  contentId?: string;
}

export interface ISendMailData {
  to: string;
  subject: string;
  variables?: Record<string, unknown>;
  path: string;
  source?: string;
  attachments?: ISendMailAttachmentData[];
}

interface IMailProvider {
  sendMail(data: ISendMailData): Promise<void>;
}

export { IMailProvider };
