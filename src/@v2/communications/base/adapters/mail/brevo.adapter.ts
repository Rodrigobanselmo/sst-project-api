import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { SendMailAdapter } from './mail.interface';
import { EmailTemplate } from '@/templates/@v2/email';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { Injectable, Logger } from '@nestjs/common';
import { config } from '@/@v2/shared/constants/config';
import * as Brevo from '@getbrevo/brevo';

// Using official Brevo SDK types

@Injectable()
export class BrevoAdapter implements SendMailAdapter {
  private readonly logger = new Logger(BrevoAdapter.name);
  private readonly whitelist = ['rodrigobanselmo@gmail.com', 'rodrigoanselmo.dev@gmail.com', 'rodrigoanselmo5555@hotmail.com'];
  private readonly apiInstance: Brevo.TransactionalEmailsApi;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    this.fromEmail = config.EMAIL.SES_FROM_EMAIL;
    this.fromName = config.EMAIL.SES_FROM_NAME;

    // Initialize Brevo SDK only if API key is available
    if (!config.EMAIL.BREVO_API_KEY) {
      this.logger.warn('Brevo API key not configured. Brevo adapter will not function.');
      return;
    }

    this.apiInstance = new Brevo.TransactionalEmailsApi();
    const apiKey = this.apiInstance.authentications['apiKey'];
    apiKey.apiKey = config.EMAIL.BREVO_API_KEY;
  }

  async sendMail({ to, type, variables, attachments }: SendMailAdapter.SendMailData): Promise<void> {
    try {
      if (!this.apiInstance) {
        throw new Error('Brevo API not initialized. Check API key configuration.');
      }

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

      // Create SendSmtpEmail object
      const sendSmtpEmail: Brevo.SendSmtpEmail = {
        subject: subject,
        htmlContent: templateHTML,
        sender: {
          name: this.fromName,
          email: this.fromEmail,
        },
        to: emailArray.map((email) => ({ email })),
        tags: ['transactional', type],
        attachment: undefined,
      };

      // Add attachments if provided
      if (attachments?.length) {
        this.validateAttachments(attachments);
        sendSmtpEmail.attachment = attachments.map((attachment) => ({
          content: attachment.content,
          name: attachment.filename,
        }));
      }

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      this.logger.log(`Email sent successfully to: ${emailArray.join(', ')}`);
      this.logger.debug(`Brevo MessageId: ${response.body.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email via Brevo: ${error.message}`, error.stack);

      if (error.body) {
        this.logger.error(`Brevo API Error: ${JSON.stringify(error.body)}`);
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
   * Test the Brevo API connection by attempting to send a test email
   */
  async testConnection(): Promise<boolean> {
    try {
      // Create a minimal test email to validate API key
      const testEmail: Brevo.SendSmtpEmail = {
        subject: 'API Test',
        textContent: 'Test connection',
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email: this.fromEmail }],
      };

      // This will throw an error if API key is invalid
      await this.apiInstance.sendTransacEmail(testEmail);
      this.logger.log('Brevo API connection test successful');
      return true;
    } catch (error) {
      this.logger.error('Brevo API connection test failed');
      return false;
    }
  }
}
