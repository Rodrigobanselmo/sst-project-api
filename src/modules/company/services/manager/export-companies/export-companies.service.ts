import { Injectable } from '@nestjs/common';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

@Injectable()
export class ExportCompaniesService {
  constructor(private readonly excelProvider: ExcelProvider) {}

  async execute() {
    // this.excelProvider.create();
  }
}
