import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { AddCompanyPhotoService } from '../../services/company/add-company-photo/add-company-photo.service';
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
  ) {}

  @Get('/:companyId')
  findOne(@User() userPayloadDto: UserPayloadDto) {
    return this.findCompanyService.execute(userPayloadDto);
  }

  @Get()
  findAll(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllCompaniesService.execute(userPayloadDto);
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

  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto) {
    return this.updateCompanyService.execute(updateCompanyDto);
  }
}
