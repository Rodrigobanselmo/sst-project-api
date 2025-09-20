import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { SendMailAdapter } from './mail.interface';
import { EmailTemplate } from '@/templates/@v2/email';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { Injectable, Logger } from '@nestjs/common';
import { config } from '@/@v2/shared/constants/config';
import axios, { AxiosInstance } from 'axios';

interface BrevoSender {
  name?: string;
  email: string;
}

interface BrevoRecipient {
  name?: string;
  email: string;
}

interface BrevoAttachment {
  content: string;
  name: string;
}

interface BrevoEmailRequest {
  sender: BrevoSender;
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachment?: BrevoAttachment[];
  tags?: string[];
}

interface BrevoEmailResponse {
  messageId: string;
}

@Injectable()
export class BrevoAdapter implements SendMailAdapter {
  private readonly logger = new Logger(BrevoAdapter.name);
  private readonly whitelist = ['rodrigobanselmo@gmail.com', 'rodrigoanselmo.dev@gmail.com'];
  private readonly httpClient: AxiosInstance;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    this.fromEmail = config.EMAIL.SES_FROM_EMAIL;
    this.fromName = config.EMAIL.SES_FROM_NAME;

    this.httpClient = axios.create({
      baseURL: 'https://api.brevo.com/v3',
      headers: {
        'api-key': config.EMAIL.BRAVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async sendMail({ to, type, variables, attachments }: SendMailAdapter.SendMailData): Promise<void> {
    try {
      const emailArray = Array.isArray(to) ? to : [to];
      const isWhitelisted = emailArray.every((email) => this.whitelist.includes(email));

      if (isDevelopment() && !isWhitelisted) {
        this.logger.debug(`Email not sent in development mode. Recipients: ${emailArray.join(', ')}`);
        return;
      }

      if (!to) {
        this.logger.warn('No recipients provided for email');
        return;
      }

      const { path, subject } = EmailTemplate[type];

      const templateFileContent = await readFile(path, 'utf-8');
      const templateParse = handlebars.compile(templateFileContent);
      const templateHTML = templateParse(variables);

      const brevoRequest: BrevoEmailRequest = {
        sender: {
          name: this.fromName,
          email: this.fromEmail,
        },
        to: emailArray.map((email) => ({ email })),
        subject,
        htmlContent: templateHTML,
        tags: ['transactional', type], // Add tags for better tracking
      };

      // Add attachments if provided
      if (attachments?.length) {
        this.validateAttachments(attachments);
        brevoRequest.attachment = attachments.map((attachment) => ({
          content: attachment.content,
          name: attachment.filename,
        }));
      }

      const response = await this.httpClient.post<BrevoEmailResponse>('/smtp/email', brevoRequest);

      this.logger.log(`Email sent successfully to: ${emailArray.join(', ')}`);
      this.logger.debug(`Brevo MessageId: ${response.data.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email via Brevo: ${error.message}`, error.stack);

      if (error.response) {
        this.logger.error(`Brevo API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }

      captureException(error);
      throw error;
    }
  }

  private validateAttachments(attachments: SendMailAdapter.SendMailAttachmentData[]): void {
    for (const attachment of attachments) {
      if (!attachment.filename || !attachment.content) {
        throw new Error(`Invalid attachment: filename and content are required`);
      }

      // Brevo expects base64 content
      if (!this.isBase64(attachment.content)) {
        throw new Error(`Invalid attachment content: must be base64 encoded`);
      }
    }
  }

  private isBase64(str: string): boolean {
    try {
      // Check if string is valid base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(str)) {
        return false;
      }

      // Try to decode and encode back
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get account information from Brevo API
   * Useful for testing API key validity
   */
  async getAccountInfo(): Promise<any> {
    try {
      const response = await this.httpClient.get('/account');
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Brevo account info: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test the Brevo API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getAccountInfo();
      this.logger.log('Brevo API connection test successful');
      return true;
    } catch (error) {
      this.logger.error('Brevo API connection test failed');
      return false;
    }
  }
}
