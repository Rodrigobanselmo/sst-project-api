import type { EmailTemplate } from '@/templates/@v2/email';

export interface SendMailAdapter {
  sendMail(data: SendMailAdapter.SendMailData): Promise<void>;
}

export namespace SendMailAdapter {
  export interface SendMailAttachmentData {
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
    contentId?: string;
  }

  export interface SendMailData {
    to: string | string[];
    type: EmailTemplate;
    variables?: Record<string, unknown>;
    attachments?: SendMailAttachmentData[];
  }
}
