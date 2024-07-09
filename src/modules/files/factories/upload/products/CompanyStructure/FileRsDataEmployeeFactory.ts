import { Injectable } from '@nestjs/common';

import { FileCompanyStructureFactory, FileCompanyStructureProduct } from './FileCompanyStructureFactory';
import { CompanyStructRsDataEmployeeColumnMap } from './constants/company-struct-rsdata-employee.constants';
import { CompanyStructColumnMap } from './constants/company-struct.constants';

@Injectable()
export class FileRsDataEmployeeFactory extends FileCompanyStructureFactory {
  public product = FileFactoryProduct;
}

class FileFactoryProduct extends FileCompanyStructureProduct {
  public async getColumns() {
    return { ...CompanyStructColumnMap, ...CompanyStructRsDataEmployeeColumnMap };
  }
}
