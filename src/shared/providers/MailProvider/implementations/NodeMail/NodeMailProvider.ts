import { ErrorMessageEnum } from '../../../../constants/enum/errorMessage';
import { UnprocessableEntityException } from '@nestjs/common';
import sgMail, { MailService } from '@sendgrid/mail';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { EmailsEnum } from '../../../../constants/enum/emails';
import { readFile } from 'fs/promises';

import { IMailProvider, ISendMailData } from '../../models/IMailProvider';

class NodeMailProvider implements IMailProvider {
  async sendMail({
    path,
    subject,
    to,
    variables,
    attachments,
    source = EmailsEnum.VALIDATION,
    sendDelevelop,
  }: ISendMailData): Promise<any> {
    try {
      if (!sendDelevelop && process.env.NODE_ENV === 'development') return;
      if (!to) return;

      const templateFileContent = await readFile(path, 'utf-8');

      const templateParse = handlebars.compile(templateFileContent);

      const templateHTML = templateParse(variables);

      // const email = 'Simplesst <manager.simplesst@gmail.com>'
      const email = 'manager.simplesst@gmail.com      ';

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: process.env.GMAIL_SMTP_PASS,
        },
      });

      await transporter.sendMail({
        to: to as string,
        from: source,
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
      console.error(JSON.stringify(error, null, 2));
      throw new UnprocessableEntityException(ErrorMessageEnum.EMAIL_NOT_SEND);
    }
  }
}

export { NodeMailProvider };
