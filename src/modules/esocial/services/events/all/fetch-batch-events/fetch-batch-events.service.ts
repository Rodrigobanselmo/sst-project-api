import { IEsocialSendBatchResponse } from '../../../../interfaces/esocial';
import {
  IESocialSendEventOptions,
  IESocialXmlStruck2220,
} from '../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { getCompanyName } from '../../../../../../shared/utils/companyName';
import { CreateESocialEvent } from '../../../../dto/esocial-batch.dto';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import JSZip from 'jszip';
import { Readable } from 'stream';
import format from 'xml-formatter';

import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { Event2220Dto } from '../../../../dto/event.dto';
import { EmployeeESocialEventTypeEnum, StatusEnum } from '@prisma/client';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyReportRepository } from '../../../../../company/repositories/implementations/CompanyReportRepository';
import { Client } from 'nestjs-soap';
import { SoapClientEnum } from '../../../../../../shared/constants/enum/soapClient';

@Injectable()
export class FetchESocialBatchEventsService {
  constructor(
    @Inject(SoapClientEnum.PRODUCTION_RESTRICT)
    private readonly soupClient: Client,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly eSocialBatchRepository: ESocialBatchRepository,
    private readonly dayJSProvider: DayJSProvider,
  ) {}

  async execute() {
    console.log(1);
    return;
  }
}
