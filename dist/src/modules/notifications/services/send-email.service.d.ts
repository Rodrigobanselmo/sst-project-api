/// <reference types="multer" />
import { PrismaService } from './../../../prisma/prisma.service';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { EmailDto } from '../dto/email.dto';
import { SendGridProvider } from '../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
export declare class SendEmailService {
    private readonly mailProvider;
    private readonly prisma;
    constructor(mailProvider: SendGridProvider, prisma: PrismaService);
    execute(user: UserPayloadDto, dto: EmailDto, files?: Array<Express.Multer.File>): Promise<void>;
    sendReferralGuide(user: UserPayloadDto, dto: EmailDto, files?: Array<Express.Multer.File>): Promise<void>;
}
