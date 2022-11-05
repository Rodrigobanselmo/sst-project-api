import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../../../../shared/decorators/public.decorator';
import { User } from '../../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { pfxFileFilter } from '../../../../../shared/utils/filters/pfx.filters';
import { AddCertDto } from '../../../dto/add-cert.dto';
import { AddCertificationESocialService } from '../../../services/events/all/add-certificate/add-certificate.service';
import { SendBatchESocialService } from '../../../services/events/all/send-batch/send-batch.service';

@ApiTags('events')
@Controller('esocial/events/all')
export class ESocialEventController {
  constructor(
    private readonly addCertificationESocialService: AddCertificationESocialService,
    private readonly sendBatchESocialService: SendBatchESocialService,
  ) {}

  @Post('certificate')
  @UseInterceptors(FileInterceptor('file', { fileFilter: pfxFileFilter }))
  addCert(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserPayloadDto,
    @Body() body: AddCertDto,
  ) {
    return this.addCertificationESocialService.execute(file, body, user);
  }

  @Public()
  @Post('send-batch')
  sendBatch() {
    return this.sendBatchESocialService.execute();
  }
}
