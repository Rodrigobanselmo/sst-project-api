import { SES } from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import { EmailsEnum } from '../../../../../shared/constants/enum/emails';
import { IMailProvider, ISendMailData } from '../../models/IMailProvider';

class AwsSesProvider implements IMailProvider {
  private client: SES;

  constructor() {
    this.client = new SES({ region: process.env.AWS_SES_REGION });
  }

  async sendMail({
    path,
    subject,
    to,
    variables,
    source = EmailsEnum.VALIDATION,
  }: ISendMailData): Promise<any> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const random = String(Math.floor(Math.random() * 1000000));

    if (process.env.APP_HOST.includes('localhost')) return;

    const message = await this.client
      .sendEmail({
        Source: source.replace(':id', random),
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: {
              Data: templateHTML,
            },
          },
        },
      })
      .promise();

    console.log('Message sent: %s', message.MessageId);
  }
}

export { AwsSesProvider };
