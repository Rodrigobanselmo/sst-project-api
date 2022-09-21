import { UserPayloadDto } from './../../../shared/dto/user-payload.dto';
import { User } from '../../../shared/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SendEmailService } from '../services/send-email.service';
import { EmailDto } from '../dto/email.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post('email')
  @UseInterceptors(FilesInterceptor('files[]', 5))
  sendEmail(
    @User() user: UserPayloadDto,
    @Body() dto: EmailDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.sendEmailService.execute(user, dto, files);
  }
}
