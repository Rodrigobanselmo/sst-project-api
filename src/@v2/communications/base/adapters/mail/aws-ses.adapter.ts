import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { SendMailAdapter } from './mail.interface';
import { EmailTemplate } from '@/templates/@v2/email';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { config } from '@/@v2/shared/constants/config';

@Injectable()
export class AwsSesAdapter implements SendMailAdapter {
  private readonly logger = new Logger(AwsSesAdapter.name);
  private readonly whitelist = ['rodrigobanselmo@gmail.com', 'rodrigoanselmo.dev@gmail.com', 'rodrigoanselmo5555@hotmail.com'];
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    this.fromEmail = config.EMAIL.SES_FROM_EMAIL;
    this.fromName = config.EMAIL.SES_FROM_NAME;

    this.sesClient = new SESClient({
      region: config.AWS.AWS_SQS_REGION,
      credentials: {
        accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS.AWS_SECRET_ACCESS_KEY,
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

      if (attachments?.length) {
        // Use SendRawEmailCommand for emails with attachments
        await this.sendRawEmail({
          to: emailArray,
          from: `${this.fromName} <${this.fromEmail}>`,
          subject,
          html: templateHTML,
          attachments,
        });
      } else {
        // Use SendEmailCommand for simple emails without attachments
        await this.sendSimpleEmail({
          to: emailArray,
          from: this.fromEmail,
          subject,
          html: templateHTML,
        });
      }

      this.logger.log(`Email sent successfully to: ${emailArray.join(', ')}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      captureException(error);
      throw error;
    }
  }

  private async sendSimpleEmail({ to, from, subject, html }: { to: string[]; from: string; subject: string; html: string }): Promise<void> {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await this.sesClient.send(command);
    this.logger.debug(`SES MessageId: ${result.MessageId}`);
  }

  private async sendRawEmail({
    to,
    from,
    subject,
    html,
    attachments,
  }: {
    to: string[];
    from: string;
    subject: string;
    html: string;
    attachments: SendMailAdapter.SendMailAttachmentData[];
  }): Promise<void> {
    // Validate attachments
    for (const attachment of attachments) {
      if (!attachment.filename || !attachment.content) {
        throw new Error(`Invalid attachment: filename and content are required`);
      }
    }

    // Build raw email with attachments
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    let rawMessage = `From: ${from}\r\n`;
    rawMessage += `To: ${to.join(', ')}\r\n`;
    rawMessage += `Subject: ${subject}\r\n`;
    rawMessage += `MIME-Version: 1.0\r\n`;
    rawMessage += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // HTML body part
    rawMessage += `--${boundary}\r\n`;
    rawMessage += `Content-Type: text/html; charset=UTF-8\r\n`;
    rawMessage += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
    rawMessage += `${html}\r\n\r\n`;

    // Attachment parts
    for (const attachment of attachments) {
      rawMessage += `--${boundary}\r\n`;
      rawMessage += `Content-Type: ${attachment.type || 'application/octet-stream'}\r\n`;
      rawMessage += `Content-Transfer-Encoding: base64\r\n`;
      rawMessage += `Content-Disposition: ${attachment.disposition || 'attachment'}; filename="${attachment.filename}"\r\n`;
      if (attachment.contentId) {
        rawMessage += `Content-ID: <${attachment.contentId}>\r\n`;
      }
      rawMessage += `\r\n${attachment.content}\r\n\r\n`;
    }

    rawMessage += `--${boundary}--\r\n`;

    const command = new SendRawEmailCommand({
      Source: from,
      Destinations: to,
      RawMessage: {
        Data: new Uint8Array(Buffer.from(rawMessage, 'utf-8')),
      },
    });

    const result = await this.sesClient.send(command);
    this.logger.debug(`SES Raw Email MessageId: ${result.MessageId}`);
  }
}
