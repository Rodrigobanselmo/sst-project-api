import { UserPayloadDto } from './../../../shared/dto/user-payload.dto';
import { User } from '../../../shared/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SendEmailService } from '../services/send-email.service';
import { EmailDto } from '../dto/email.dto';
import {
  CreateNotificationDto,
  FindNotificationDto,
  UpdateUserNotificationDto,
} from '../dto/nofication.dto';
import { ListNotificationService } from '../services/list-notification.service';
import { CreateNotificationService } from '../services/create-notification.service';
import { ListCompanyNotificationService } from '../services/list-company-notification.service';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { RoleEnum } from '../../../shared/constants/enum/authorization';
import { UpdateUserNotificationService } from '../services/update-user-notification.service';
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly listNotificationService: ListNotificationService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly listCompanyNotificationService: ListCompanyNotificationService,
    private readonly updateUserNotificationService: UpdateUserNotificationService,
  ) {}

  @Roles(RoleEnum.NOTIFICATION)
  @Post()
  sendNotification(
    @User() user: UserPayloadDto,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.createNotificationService.execute(user, dto);
  }

  @Post('email')
  @UseInterceptors(FilesInterceptor('files[]', 5))
  sendEmail(
    @User() user: UserPayloadDto,
    @Body() dto: EmailDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.sendEmailService.execute(user, dto, files);
  }

  @Patch(':id/user')
  updateUser(
    @User() user: UserPayloadDto,
    @Body() dto: UpdateUserNotificationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateUserNotificationService.execute(user, { ...dto, id });
  }

  @Get()
  listNotification(
    @User() user: UserPayloadDto,
    @Query() query: FindNotificationDto,
  ) {
    return this.listNotificationService.execute(user, query);
  }

  @Roles(RoleEnum.NOTIFICATION)
  @Get('company')
  listCompanyNotification(
    @User() user: UserPayloadDto,
    @Query() query: FindNotificationDto,
  ) {
    return this.listCompanyNotificationService.execute(user, query);
  }
}
