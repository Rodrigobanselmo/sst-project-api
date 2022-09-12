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
import { FindActivityDto } from '../../dto/activity.dto';
import { SetCompanyClinicDto } from '../../dto/company-clinic.dto';
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
import { FindAllUserCompaniesService } from '../../services/company/find-all-user-companies /find-all-companies.service';
import { FindCepService } from '../../services/company/find-cep/find-cep.service';
import { FindClinicService } from '../../services/company/find-clinic/find-clinic.service';
import { FindCnaeService } from '../../services/company/find-cnae/find-cnae.service';
import { FindCnpjService } from '../../services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from '../../services/company/find-company/find-company.service';
import { SetCompanyClinicsService } from '../../services/company/set-company-clinics/set-company-clinics.service';
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
    private readonly findAllUserCompaniesService: FindAllUserCompaniesService,
    private readonly findCompanyService: FindCompanyService,
    private readonly findCnpjService: FindCnpjService,
    private readonly findCepService: FindCepService,
    private readonly findCnaeService: FindCnaeService,
    private readonly copyCompanyService: CopyCompanyService,
    private readonly setCompanyClinicsService: SetCompanyClinicsService,
    private readonly findClinicService: FindClinicService,
  ) {}

  @Get()
  findAll(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindCompaniesDto,
  ) {
    return this.findAllCompaniesService.execute(userPayloadDto, query);
  }

  @Get('by-user')
  findAllByUser(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindCompaniesDto,
  ) {
    return this.findAllUserCompaniesService.execute(userPayloadDto, query);
  }

  @Get('/cnae')
  findCNAE(@Query() query: FindActivityDto) {
    return this.findCnaeService.execute(query);
  }

  @Get('/:companyId')
  findOne(@User() userPayloadDto: UserPayloadDto) {
    return this.findCompanyService.execute(userPayloadDto);
  }

  @Get('/clinic/:companyId')
  findClinicOne(@User() userPayloadDto: UserPayloadDto) {
    return this.findClinicService.execute(userPayloadDto);
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

  @Post('/:companyId/set-clinics')
  setClinics(
    @Body() setCompanyClinicDto: SetCompanyClinicDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.setCompanyClinicsService.execute(
      setCompanyClinicDto,
      userPayloadDto,
    );
  }
}
