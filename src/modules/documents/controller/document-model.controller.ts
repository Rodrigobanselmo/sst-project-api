import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';

import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { CreateDocumentModelDto, FindDocumentModelDto, IGetDocumentModelData, UpdateDocumentModelDto } from '../dto/document-model.dto';
import { CreateDocumentModelService } from '../services/document/document-models/create-document-model.service';
import { FindDocumentModelService } from '../services/document/document-models/find-document-model.service';
import { FindOneDocumentModelService } from '../services/document/document-models/find-one-document-model.service';
import { UpdateDocumentModelService } from '../services/document/document-models/update-document-model.service';
import { GetDocVariablesService } from '../services/document/document/get-doc-variables.service';
import { Response } from 'express';

@ApiTags('document-model')
@Controller('document-model')
export class DocumentModelController {
  constructor(
    private readonly updateDocumentModelService: UpdateDocumentModelService,
    private readonly createDocumentModelService: CreateDocumentModelService,
    private readonly findAvailableDocumentModelService: FindDocumentModelService,
    private readonly findOneDocumentModelService: FindOneDocumentModelService,
    private readonly getDocVariablesService: GetDocVariablesService,
  ) {}

  @Get('/:companyId/:id/data')
  async findDocumentModelData(@Res() response: Response, @User() user: UserPayloadDto, @Param('id', ParseIntPipe) id: number, @Query() query: IGetDocumentModelData) {
    const json = await this.getDocVariablesService.execute(id, { ...query, companyId: user.targetCompanyId });
    const jsonStream = new Readable({
      read() {
        this.push(JSON.stringify(json));
        this.push(null);
      },
    });

    response.setHeader('Content-Type', 'application/json');
    jsonStream.pipe(response);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENT_MODEL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId/:id')
  findOne(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findOneDocumentModelService.execute(id, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.DOCUMENT_MODEL,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get('/:companyId')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindDocumentModelDto) {
    return this.findAvailableDocumentModelService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENT_MODEL,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Permissions({
    code: PermissionEnum.DOCUMENT_MODEL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId')
  create(@Body() upsertAccessGroupDto: CreateDocumentModelDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createDocumentModelService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENT_MODEL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:companyId/:id')
  async update(@Body() upsertAccessGroupDto: UpdateDocumentModelDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    const data = await this.updateDocumentModelService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
    return data;
  }

  // @Permissions({
  //   code: PermissionEnum.DOCUMENT_MODEL,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  // @Delete('/:companyId/:id')
  // delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
  //   return this.deleteDocumentModelService.execute(id, userPayloadDto);
  // }
}
