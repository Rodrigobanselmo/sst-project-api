import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertDocumentCoverService } from '../../services/document-cover/upsert-document-cover/upsert-document-cover.service';
import { FindDocumentCoverService } from '../../services/document-cover/find-document-cover/find-document-cover.service';
import { DeleteDocumentCoverService } from '../../services/document-cover/delete-document-cover/delete-document-cover.service';
import { PreviewDocumentCoverService } from '../../services/document-cover/preview-document-cover/preview-document-cover.service';

@Controller('company/:companyId/document-cover')
@UseGuards(JwtAuthGuard)
export class DocumentCoverController {
  constructor(
    private readonly upsertDocumentCoverService: UpsertDocumentCoverService,
    private readonly findDocumentCoverService: FindDocumentCoverService,
    private readonly deleteDocumentCoverService: DeleteDocumentCoverService,
    private readonly previewDocumentCoverService: PreviewDocumentCoverService,
  ) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto) {
    return this.findDocumentCoverService.execute(userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upsert(
    @UploadedFile() file: any,
    @Body('json') jsonString: string,
    @Body('id') id: string,
    @Body('name') name: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    const json = jsonString ? JSON.parse(jsonString) : undefined;
    const body = {
      id: id ? Number(id) : undefined,
      name,
      json,
    };
    return this.upsertDocumentCoverService.execute(body, userPayloadDto, file);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Post('/preview')
  async preview(@Res() res: Response, @Body() data: any) {
    const { buffer, fileName } = await this.previewDocumentCoverService.execute(data);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteDocumentCoverService.execute(id, userPayloadDto);
  }
}

