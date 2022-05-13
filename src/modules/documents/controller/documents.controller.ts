import { Controller, Get, Param, Res } from '@nestjs/common';
import { Packer } from 'docx';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { PgrDownloadService } from '../services/pgr/download-pgr.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly pgrDownloadService: PgrDownloadService) {}

  @Get('/pgr/:groupId/:companyId?')
  async downloadPGR(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('groupId') riskGroupId: string,
  ) {
    const doc = await this.pgrDownloadService.execute(
      userPayloadDto,
      riskGroupId,
    );

    const b64string = await Packer.toBase64String(doc);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=My Document.docx',
    );
    res.send(Buffer.from(b64string, 'base64'));
  }
}
