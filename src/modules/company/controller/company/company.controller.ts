import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../shared/decorators/public.decorator';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CreateContractDto } from '../../dto/create-contract.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
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

  @Public()
  @Get('cep/:cep')
  findCEP(@Param('cep') cep: string) {
    return this.findCepService.execute(cep);
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyService.execute(createCompanyDto);
  }

  @Post('contract')
  createChild(@Body() createContractDto: CreateContractDto) {
    return this.createContractService.execute(createContractDto);
  }

  // edit company data or create if does not exist like workplace / primary_activity
  @Patch()
  update(@Body() updateCompanyDto: UpdateCompanyDto) {
    // cant edit this type of data
    delete updateCompanyDto.isConsulting;
    delete updateCompanyDto.license;

    return this.updateCompanyService.execute(updateCompanyDto);
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
