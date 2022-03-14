import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CreateContractDto } from '../../dto/create-contract.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { CreateCompanyService } from '../../services/manager/create-company/create-company.service';
import { CreateContractService } from '../../services/manager/create-contract/create-contract.service';
import { FindAllCompaniesService } from '../../services/manager/find-all-companies/find-all-companies.service';
import { UpdateCompanyService } from '../../services/manager/update-company/update-company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly createContractService: CreateContractService,
    private readonly updateCompanyService: UpdateCompanyService,
    private readonly findAllCompaniesService: FindAllCompaniesService,
  ) {}

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

  @Get('all')
  export(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllCompaniesService.execute(userPayloadDto);
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