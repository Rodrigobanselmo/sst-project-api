import { Injectable } from '@nestjs/common';
import { DocumentPGRFactory } from '../../../../../documents/factories/document/products/PGR/DocumentPGRFactory';
import { DownloadRiskStructureReportDto } from '../../../../dto/risk-structure-report.dto';

import { ExcelProvider } from '../../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../../creator/ReportFactoryCreator';
import {
  IReportFactoryProduct
} from '../../types/IReportFactory.types';
import { RiskStructureRsDataACGH } from './RiskStructureRsDataACGH';
import { RiskStructureRsDataNR } from './RiskStructureRsDataNR';

@Injectable()
export class ReportRiskStructureRsDataFactory extends ReportFactoryAbstractionCreator<DownloadRiskStructureReportDto> {
  constructor(private readonly documentPGRFactory: DocumentPGRFactory, private readonly companyRepository: CompanyRepository, private readonly excelProv: ExcelProvider) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any>[] {
    return [new RiskStructureRsDataNR(this.documentPGRFactory, this.companyRepository), new RiskStructureRsDataACGH(this.documentPGRFactory, this.companyRepository)];
  }
}
