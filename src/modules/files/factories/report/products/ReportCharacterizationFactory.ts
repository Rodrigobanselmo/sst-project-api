import { DownloudCharacterizationReportDto } from './../../../dto/characterization-report.dto';
import { PaginationQueryDto } from '../../../../../shared/dto/pagination.dto';
import { formatCEP } from '@brazilian-utils/brazilian-utils';
import { Injectable } from '@nestjs/common';

import { clinicScheduleMap, companyPaymentScheduleMap } from '../../../../../shared/constants/maps/enumTraslate.map';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { formatPhoneNumber } from '../../../../../shared/utils/formats';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
} from '../types/IReportFactory.types';
import { CompanyCharacterization, CompanyCharacterizationPhoto, Status } from '@prisma/client';
import { CharacterizationTypeMap } from '../constants/characterization-type-map';
import dayjs from 'dayjs';
import { ReportCharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class ReportCharacterizationFactory extends ReportFactoryAbstractionCreator<DownloudCharacterizationReportDto> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly characterizationRepository: ReportCharacterizationRepository,
    private readonly excelProv: ExcelProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<DownloudCharacterizationReportDto> {
    return new ReportFactoryProduct(this.characterizationRepository);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<DownloudCharacterizationReportDto> {
  constructor(private readonly characterizationRepository: ReportCharacterizationRepository) { }

  public async findTableData(companyId: string, query: DownloudCharacterizationReportDto) {
    const char = await this.characterizationRepository.list(
      companyId,
      query.workspaceId,
    );

    const sanitizeData = this.sanitizeData(char);
    const headerData = this.getHeader();
    const titleData = this.getTitle(headerData);
    const infoData = this.getEndInformation(char.length);

    const returnData: IReportFactoryProductFindData = {
      headerRow: headerData,
      titleRows: titleData,
      endRows: infoData,
      sanitizeData,
    };

    return returnData;
  }

  public sanitizeData(clinics: (CompanyCharacterization & { photos: CompanyCharacterizationPhoto[]; stage?: Status })[]): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = clinics.map<IReportSanitizeData>((row) => {
      const type = CharacterizationTypeMap[row.type].rowLabel || '';

      const sanitazeRow: IReportSanitizeData = {
        name: { content: row.name },
        done: { content: row.done_at ? `Finalizado em ${dayjs(row.done_at).format('DD/MM/YYYY')}` : '' },
        type: { content: type },
        stage: { content: row.stage?.name || '' },
        photos: { content: row.photos.length },
      };

      return sanitazeRow;
    });

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Relatorio de caracterização ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Lista de caracterização`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header = [
      { database: 'name', content: 'Nome', width: 120 },
      { database: 'type', content: 'Tipo', width: 100 },
      { database: 'stage', content: 'Status', width: 100 },
      { database: 'done', content: 'Finalizado', width: 100 },
      { database: 'photos', content: 'Quantidade de Fotos', width: 50 },
    ];

    return header;
  }

  public getTitle(header: IReportHeader): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Relação de Ambinetes | Equipamentos | Postos | Atividades ', mergeRight: header.length - 1 }];
    const rows = [row];

    return rows;
  }

  public getEndInformation(count: number): IReportCell[][] {
    const row: IReportCell[] = [{ content: `Total: ${count}`, mergeRight: 'all' }];
    const rows = [row];

    return rows;
  }
}
