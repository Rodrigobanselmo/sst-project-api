import { Public } from './../../../../shared/decorators/public.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindActivityDto } from '../../dto/activity.dto';
import { SetCompanyClinicDto, TestRoute123CompanyDto } from '../../dto/company-clinic.dto';
import {
  CreateCompanyDto,
  FindCompaniesDto,
  UpdateApplyServiceCompanyDto,
  UpdateCompanyDto,
} from '../../dto/company.dto';
import { AddCompanyPhotoService } from '../../services/company/add-company-photo/add-company-photo.service';
import { CopyCompanyService } from '../../services/company/copy-company/copy-company.service';
import { CreateCompanyService } from '../../services/company/create-company/create-company.service';
import { CreateContractService } from '../../services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from '../../services/company/find-all-companies/find-all-companies.service';
import { FindAllUserCompaniesService } from '../../services/company/find-all-user-companies /find-all-companies.service';
import { FindCepService } from '../../services/company/find-cep/find-cep.service';
import { FindClinicService } from '../../services/company/find-one-clinic/find-clinic.service';
import { FindCnaeService } from '../../services/company/find-cnae/find-cnae.service';
import { FindCnpjService } from '../../services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from '../../services/company/find-one-company/find-company.service';
import { SetCompanyClinicsService } from '../../services/company/set-company-clinics/set-company-clinics.service';
import { UpdateCompanyService } from '../../services/company/update-company/update-company.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UpdateAllCompaniesService } from '../../services/report/update-all-companies/update-all-companies.service';
import { FindCompanyDashDto } from '../../dto/dashboard.dto';
import { DashboardCompanyService } from '../../services/report/dashboard-company/dashboard-company.service';
import { UpdateApplyServiceCompanyService } from '../../services/company/update-apply-service-company/update-apply-service-company.service';
import { DeleteCompanyService } from '../../services/company/delete-company/delete-company.service';

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
    private readonly dashboardCompanyService: DashboardCompanyService,
    private readonly updateAllCompaniesService: UpdateAllCompaniesService,
    private readonly updateApplyServiceCompanyService: UpdateApplyServiceCompanyService,
    private readonly deleteCompanyService: DeleteCompanyService,
  ) { }

  @Roles(RoleEnum.COMPANY, RoleEnum.CONTRACTS, RoleEnum.CLINICS, RoleEnum.USER, RoleEnum.DOCTOR)
  @Permissions({ isContract: true, isMember: true })
  @Get('/:companyId/dashboard')
  dashboard(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCompanyDashDto) {
    return this.dashboardCompanyService.execute(query, userPayloadDto);
    // return this.updateAllCompaniesService.execute(userPayloadDto);
  }

  @Roles(RoleEnum.COMPANY, RoleEnum.CONTRACTS, RoleEnum.CLINICS, RoleEnum.USER)
  @Permissions({ isContract: true, isMember: true })
  @Get()
  findAll(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCompaniesDto) {
    return this.findAllCompaniesService.execute(userPayloadDto, query);
  }

  @Get('by-user')
  findAllByUser(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCompaniesDto) {
    return this.findAllUserCompaniesService.execute(userPayloadDto, query);
  }

  @Get('/cnae')
  findCNAE(@Query() query: FindActivityDto) {
    return this.findCnaeService.execute(query);
  }

  @Permissions(
    {
      isMember: true,
    },
    {
      code: PermissionEnum.COMPANY,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.CLINIC,
      isContract: true,
      isMember: true,
    },
  )
  @Get('/:companyId')
  findOne(@User() userPayloadDto: UserPayloadDto) {
    return this.findCompanyService.execute(userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.COMPANY,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.CLINIC,
      isContract: true,
      isMember: true,
    },
  )
  @Get('/clinic/:clinicId')
  findClinicOne(@Param('clinicId') clinicId: string, @User() userPayloadDto: UserPayloadDto) {
    return this.findClinicService.execute(clinicId, userPayloadDto);
  }

  @Get('cnpj/:cnpj')
  findCNPJ(@Param('cnpj') cnpj: string) {
    return this.findCnpjService.execute(cnpj);
  }

  @Get('cep/:cep')
  findCEP(@Param('cep') cep: string) {
    return this.findCepService.execute(cep);
  }

  @Roles(RoleEnum.CONTRACTS)
  @Permissions({
    code: PermissionEnum.CONTRACTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() userPayloadDto: UserPayloadDto) {
    if (userPayloadDto.isMaster) {
      return this.createCompanyService.execute(createCompanyDto);
    }
    return this.createContractService.execute(createCompanyDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CLINIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('clinic')
  createClinic(@Body() createCompanyDto: CreateCompanyDto, @User() userPayloadDto: UserPayloadDto) {
    if (!createCompanyDto.isClinic) throw new BadRequestException('Erro ao criar clínica');

    return this.createContractService.execute(createCompanyDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(@UploadedFile() file: Express.Multer.File, @User() userPayloadDto: UserPayloadDto) {
    return this.addCompanyPhotoService.execute(userPayloadDto, file);
  }

  @Permissions({
    code: PermissionEnum.MASTER,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId/set-apply-service')
  updateService(@Body() body: UpdateApplyServiceCompanyDto, @User() userPayloadDto: UserPayloadDto) {
    return this.updateApplyServiceCompanyService.execute(body, userPayloadDto.targetCompanyId);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto) {
    delete updateCompanyDto.status;
    return this.updateCompanyService.execute(updateCompanyDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: 'd',
  })
  @Patch('all')
  updateFull(@Body() updateCompanyDto: UpdateCompanyDto) {
    return this.updateCompanyService.execute(updateCompanyDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/copy/:copyFromCompanyId/:riskGroupId/:companyId')
  copy(
    @Param('copyFromCompanyId') copyFromCompanyId: string,
    @Param('riskGroupId') riskGroupId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.copyCompanyService.execute(copyFromCompanyId, riskGroupId, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CLINIC_COMPANY_LINK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId/set-clinics')
  setClinics(@Body() setCompanyClinicDto: SetCompanyClinicDto, @User() userPayloadDto: UserPayloadDto) {
    return this.setCompanyClinicsService.execute(setCompanyClinicDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Delete('/:companyId')
  delete(@User() userPayloadDto: UserPayloadDto) {
    return this.deleteCompanyService.execute(userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.CLINIC,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Delete('/:companyId/clinic')
  deleteClinic(@User() userPayloadDto: UserPayloadDto) {
    return this.deleteCompanyService.execute(userPayloadDto, { clinic: true });
  }

  @Public()
  @Post('/test-route-123')
  test(@Body() body: TestRoute123CompanyDto) {
    // const x = {} as any;

    // x.x.x;

    throw new Error('niohoi');
    return body;
  }
}
