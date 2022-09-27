import { PrismaService } from './../../../prisma/prisma.service';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { EmailDto } from '../dto/email.dto';
import { resolve } from 'path';
import { SendGridProvider } from '../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly mailProvider: SendGridProvider,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    user: UserPayloadDto,
    dto: EmailDto,
    files?: Array<Express.Multer.File>,
  ) {
    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'templates',
      'email',
      'referralGuide.hbs',
    );

    await this.mailProvider.sendMail({
      path: templatePath,
      subject: 'Guia Exame Médico',
      to: 'rodrigoanselmo.dev@gmail.com',
      attachments: files.map((file) => {
        return {
          content: file.buffer.toString('base64'),
          type: 'application/pdf',
          filename: 'attachment.pdf',
        };
      }),
      // variables,
    });
  }

  // async sendReferralGuide(
  //   user: UserPayloadDto,
  //   dto: EmailDto,
  //   files?: Array<Express.Multer.File>,
  // ) {
  //   const templatePath = resolve(
  //     __dirname,
  //     '..',
  //     '..',
  //     '..',
  //     '..',
  //     '..',
  //     'templates',
  //     'email',
  //     'referralGuide.hbs',
  //   );

  //   await this.mailProvider.sendMail({
  //     path: templatePath,
  //     subject: 'Convite para se tornar membro',
  //     to: invite.email,
  //     variables,
  //   });
  // }
}
