import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { MailAdapter } from './mail.interface';
import { EmailType } from '../../../../templates/@v2/email';
import { isDevelopmentGetter } from '../../utils/helpers/is-development';

export class NodeMailerAdapter implements MailAdapter {
  async sendMail({ to, type, variables, attachments }: MailAdapter.SendMailData): Promise<any> {
    try {
      if (isDevelopmentGetter()) return;
      if (!to) return;

      const { path, subject } = EmailType[type];

      const templateFileContent = await readFile(path, 'utf-8');

      const templateParse = handlebars.compile(templateFileContent);

      const templateHTML = templateParse(variables);

      const email = 'manager.simplesst@gmail.com';

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: process.env.GMAIL_SMTP_PASS,
        },
      });

      await transporter.sendMail({
        to: to as string,
        from: 'Simplesst <noreply@simplesst.com.br>',
        subject: subject,
        html: templateHTML,
        ...(attachments?.length && {
          attachments: attachments?.map((attachment) => ({
            content: attachment.content,
            filename: attachment.filename,
            contentType: attachment.type,
          })),
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
}
