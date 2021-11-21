import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Permission } from '../../../shared/constants/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { CreateContractDto } from '../dto/create-contract.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CreateContractService } from '../services/create-contract/create-contract.service';
import { CreateCompanyService } from '../services/create-company/create-company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly createContractService: CreateContractService,
  ) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_COMPANY,
    checkCompany: true,
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyService.execute(createCompanyDto);
  }

  @Post('contract')
  @Permissions({
    code: Permission.CREATE_COMPANY,
    checkCompany: true,
  })
  createChild(@Body() createContractDto: CreateContractDto) {
    return this.createContractService.execute(createContractDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.createCompanyService.update(+id, updateCompanyDto);
  // }
}
