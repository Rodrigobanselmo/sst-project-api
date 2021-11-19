import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../../dto/update-company.dto';

@Injectable()
export class UpdateCompanyService {
  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }
}
