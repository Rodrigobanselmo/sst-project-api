import { ErrorMessageEnum } from '../../../../constants/enum/errorMessage';
import { UnprocessableEntityException } from '@nestjs/common';
import sgMail, { MailService } from '@sendgrid/mail';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { EmailsEnum } from '../../../../constants/enum/emails';

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

      const templateFileContent = fs.readFileSync(path).toString('utf-8');

      const templateParse = handlebars.compile(templateFileContent);

      const templateHTML = templateParse(variables);

      const email = source.match(/<([^>]+)>/)[1];

      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        secure: true,
        port: 465,
        auth: {
          user: email,
          pass: process.env.ZOHO_PASS,
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
