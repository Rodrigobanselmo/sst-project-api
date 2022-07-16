import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateCompanyDto,
  FindCompaniesDto,
} from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { AddCompanyPhotoService } from '../../services/company/add-company-photo/add-company-photo.service';
import { CopyCompanyService } from '../../services/company/copy-company/copy-company.service';
import { CreateCompanyService } from '../../services/company/create-company/create-company.service';
import { CreateContractService } from '../../services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from '../../services/company/find-all-companies/find-all-companies.service';
import { FindCepService } from '../../services/company/find-cep/find-cep.service';
import { FindCnpjService } from '../../services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from '../../services/company/find-company/find-company.service';
import { UpdateCompanyService } from '../../services/company/update-company/update-company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly createContractService: CreateContractService,
    private readonly addCompanyPhotoService: AddCompanyPhotoService,
    private readonly updateCompanyService: UpdateCompanyService,
    private readonly findAllCompaniesService: FindAllCompaniesService,
    private readonly findCompanyService: FindCompanyService,
    private readonly findCnpjService: FindCnpjService,
    private readonly findCepService: FindCepService,
    private readonly copyCompanyService: CopyCompanyService,
  ) {}

  @Get('/:companyId')
  findOne(@User() userPayloadDto: UserPayloadDto) {
    return this.findCompanyService.execute(userPayloadDto);
  }

  @Get()
  findAll(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindCompaniesDto,
  ) {
    return this.findAllCompaniesService.execute(userPayloadDto, query);
  }

  @Get('cnpj/:cnpj')
  findCNPJ(@Param('cnpj') cnpj: string) {
    return this.findCnpjService.execute(cnpj);
  }

  @Get('cep/:cep')
  findCEP(@Param('cep') cep: string) {
    return this.findCepService.execute(cep);
  }

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    if (userPayloadDto.isMaster) {
      return this.createCompanyService.execute(createCompanyDto);
    }
    return this.createContractService.execute(createCompanyDto, userPayloadDto);
  }

  @Post('/:companyId/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.addCompanyPhotoService.execute(userPayloadDto, file);
  }

  // @Post('contract')
  // createChild(@Body() createContractDto: CreateContractDto) {
  //   return this.createContractService.execute(createContractDto);
  // }

  // edit company data or create if does not exist like workspace / primary_activity
  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto) {
    return this.updateCompanyService.execute(updateCompanyDto);
  }

  @Post('/copy/:copyFromCompanyId/:riskGroupId/:companyId')
  copy(
    @Param('copyFromCompanyId') copyFromCompanyId: string,
    @Param('riskGroupId') riskGroupId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.copyCompanyService.execute(
      copyFromCompanyId,
      riskGroupId,
      userPayloadDto,
    );
  }

  // TODO: create disconnect users or activities or...
  // @Patch('update/disconnect/:companyId')
  // updateDisconnect(
  //   @Param('companyId') id: string,
  //   @Body() updateCompanyDto: UpdateCompanyDto,
  // ) {
  //   delete updateCompanyDto.myCompanyId;
  //   delete updateCompanyDto.isConsulting;
  //   delete updateCompanyDto.cnpj;
  //   delete updateCompanyDto.license;

  //   return this.updateCompanyService.execute(id, updateCompanyDto);
  // }
}
