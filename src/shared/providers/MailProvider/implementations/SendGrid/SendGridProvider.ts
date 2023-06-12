import { ErrorMessageEnum } from './../../../../constants/enum/errorMessage';
import { UnprocessableEntityException } from '@nestjs/common';
import sgMail, { MailService } from '@sendgrid/mail';
import fs from 'fs';
import handlebars from 'handlebars';
import { EmailsEnum } from '../../../../../shared/constants/enum/emails';

import { IMailProvider, ISendMailData } from '../../models/IMailProvider';

class SendGridProvider implements IMailProvider {
  private client: MailService;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.client = sgMail;
  }

  async sendMail({ path, subject, to, variables, attachments, source = EmailsEnum.VALIDATION, sendDelevelop }: ISendMailData): Promise<any> {
    try {
      if (!sendDelevelop && process.env.NODE_ENV === 'development') return;
      if (!to) return;

      const templateFileContent = fs.readFileSync(path).toString('utf-8');

      const templateParse = handlebars.compile(templateFileContent);

      const templateHTML = templateParse(variables);

      const random = String(Math.floor(Math.random() * 1000000));

      await this.client.send({
        to: to as string,
        from: source.replace(':id', random),
        subject: subject,
        html: templateHTML,
        attachments,
        replyTo: source.replace(':id', random),
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      throw new UnprocessableEntityException(ErrorMessageEnum.EMAIL_NOT_SEND);
    }
  }
}

export { SendGridProvider };
