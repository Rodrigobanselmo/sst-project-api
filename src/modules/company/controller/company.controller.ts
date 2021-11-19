import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateCompanyDto } from '../dto/create-company.dto';
// import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CreateCompanyService } from '../services/create-company/create-company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly createCompanyService: CreateCompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.createCompanyService.execute(createCompanyDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.createCompanyService.update(+id, updateCompanyDto);
  // }
}
