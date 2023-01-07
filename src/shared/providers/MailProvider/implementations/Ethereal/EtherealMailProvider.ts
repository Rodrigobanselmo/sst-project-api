import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { IMailProvider, ISendMailData } from '../../models/IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    if (process.env.NODE_ENV !== 'test')
      nodemailer
        .createTestAccount()
        .then((account) => {
          const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass,
            },
          });

          this.client = transporter;
        })
        .catch((err) => {
          console.error(`Failed to create a testing account. ${err.message}`);
        });
  }

  async sendMail({ path, subject, to, variables }: ISendMailData): Promise<any> {
    if (process.env.NODE_ENV === 'test') return;
    if (process.env.NODE_ENV === 'development') return;

    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      from: 'simple <noreply@simple.com.br>',
      to,
      subject,
      html: templateHTML,
    });

    console.info('Message sent: %s', message.messageId);
    console.info('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
