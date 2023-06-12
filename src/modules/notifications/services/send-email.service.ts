import { EmailsTemplatesEnum } from './../../../shared/constants/enum/emailsTemplates';
import { PrismaService } from './../../../prisma/prisma.service';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { EmailDto } from '../dto/email.dto';
import { resolve } from 'path';
import { NodeMailProvider } from '../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';

@Injectable()
export class SendEmailService {
  constructor(private readonly mailProvider: NodeMailProvider, private readonly prisma: PrismaService) { }

  async execute(user: UserPayloadDto, dto: EmailDto, files?: Array<Express.Multer.File>) {
    if (dto.template === EmailsTemplatesEnum.REFERRAL_GUIDE) {
      this.sendReferralGuide(user, dto, files);
    }
  }

  async sendReferralGuide(user: UserPayloadDto, dto: EmailDto, files?: Array<Express.Multer.File>) {
    const templatePath = resolve(__dirname, '..', '..', '..', '..', 'templates', 'email', 'referralGuide.hbs');

    await this.mailProvider.sendMail({
      path: templatePath,
      subject: 'Guia Exame Médico',
      to: dto.emails,
      attachments: files.map((file) => {
        return {
          content: file.buffer.toString('base64'),
          type: 'application/pdf',
          filename: 'guia-de-encaminhamento.pdf',
        };
      }),
    });
  }
}
