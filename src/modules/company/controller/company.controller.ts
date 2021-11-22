import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Permission } from '../../../shared/constants/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { CreateContractDto } from '../dto/create-contract.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CreateContractService } from '../services/create-contract/create-contract.service';
import { CreateCompanyService } from '../services/create-company/create-company.service';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { UpdateCompanyService } from '../services/update-company/update-company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly createContractService: CreateContractService,
    private readonly updateCompanyService: UpdateCompanyService,
  ) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_COMPANY,
    isMember: true,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyService.execute(createCompanyDto);
  }

  @Post('contract')
  @Permissions({
    code: Permission.CREATE_COMPANY,
    isMember: true,
  })
  createChild(@Body() createContractDto: CreateContractDto) {
    return this.createContractService.execute(createContractDto);
  }

  @Patch('update/insert/:companyId')
  updateInsert(
    @Param('companyId') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    delete updateCompanyDto.myCompanyId;
    delete updateCompanyDto.isConsulting;
    delete updateCompanyDto.cnpj;
    delete updateCompanyDto.license;

    return this.updateCompanyService.execute(id, updateCompanyDto);
  }

  // TODO
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
