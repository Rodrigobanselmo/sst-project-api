import { EmailType } from './templates';

export interface MailAdapter {
  sendMail(data: MailAdapter.SendMailData): Promise<void>;
}

export namespace MailAdapter {
  export interface SendMailAttachmentData {
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
    contentId?: string;
  }

  export interface SendMailData {
    to: string | string[];
    type: EmailType;
    variables?: Record<string, unknown>;
    attachments?: SendMailAttachmentData[];
  }
}
