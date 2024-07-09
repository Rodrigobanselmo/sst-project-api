import fs from 'fs';
import handlebars from 'handlebars';
import { EmailsEnum } from '../../../../../shared/constants/enum/emails';
import { IMailProvider, ISendMailData } from '../../models/IMailProvider';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

class AwsSesProvider implements IMailProvider {
  private client: SESClient;

  constructor() {
    this.client = new SESClient({ region: process.env.AWS_SES_REGION });
  }

  async sendMail({ path, subject, to, variables, source = EmailsEnum.VALIDATION }: ISendMailData): Promise<any> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const random = String(Math.floor(Math.random() * 1000000));

    if (process.env.APP_HOST.includes('localhost')) return;

    if (!(typeof to === 'string')) return;

    const command = new SendEmailCommand({
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
    });

    const message = await this.client.send(command);

    console.info('Message sent: %s', message.MessageId);
  }
}

export { AwsSesProvider };
