import { isMissingDataConfigJson } from './../../../entities/alert.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AlertDto } from '../../../dto/alert.dto';
import { AlertRepository } from '../../../repositories/implementations/AlertRepository';
import { FindOneAlertService } from '../find-alert/find-alert.service';
import { isValidEmail } from '@brazilian-utils/brazilian-utils';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class UpsertAlertService {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly dayjsProvider: DayJSProvider,
    private readonly findOneAlertService: FindOneAlertService,
  ) {}

  async execute({ removeEmails, ...body }: AlertDto, user: UserPayloadDto) {
    const findAlert = await this.alertRepository.findFirstNude({ where: { companyId: user.targetCompanyId, type: body.type }, select: { emails: true } });
    const system = user.isSystem;

    if (body?.emails) {
      body?.emails.forEach((email) => {
        if (!isValidEmail(email)) throw new BadRequestException('Email enviado inválido');
      });
    }

    const emails = [...(findAlert?.emails || []), ...(body?.emails || [])].filter((email) => (removeEmails ? !removeEmails?.includes(email) : true));
    const nextAlert = this.getNextDate(body.configJson);

    const alert = await this.alertRepository.upsert({
      ...body,
      nextAlert,
      companyId: user.targetCompanyId,
      emails: removeDuplicate(emails),
      system,
    });

    return alert;
  }

  getNextDate(configJson?: AlertDto['configJson']) {
    if (!configJson) return undefined;
    if (isMissingDataConfigJson(configJson)) return null;

    const actualDate = new Date('2023-02-14');

    const cronEveryNumbersOfWeeks = configJson?.everyNumbersOfWeeks;
    const time = configJson?.time || 500;
    const cronWeekDays = configJson?.weekDays;
    const cronMinWeekDay = Math.min(...cronWeekDays);

    if (!cronWeekDays?.length) return null;
    if (!cronEveryNumbersOfWeeks) return null;

    const firstDateOfYear = this.dayjsProvider.dayjs(actualDate).set('month', 0).set('date', 1);
    const firstDayOfYear = firstDateOfYear.day() || 7;
    const daysToFirstMondayOfYear = 6 - firstDayOfYear + 2;
    const firstMondayOfYear = firstDateOfYear.add(daysToFirstMondayOfYear, 'days');

    const diffDays = -firstMondayOfYear.diff(actualDate, 'days');
    const diffWeeks = Math.floor((diffDays > 0 ? diffDays : 0) / 7);
    const actualDay = (diffDays % 7) + 1; // mondey will be 1, tuesday 2 ....

    let daysRemaining: number;
    let weeksRemaining = cronEveryNumbersOfWeeks - (diffWeeks % cronEveryNumbersOfWeeks || cronEveryNumbersOfWeeks);

    if (!weeksRemaining) {
      const nextDay = cronWeekDays.find((cronDay) => actualDay < cronDay);
      daysRemaining = nextDay ? nextDay - actualDay : 7 - actualDay + cronMinWeekDay;

      weeksRemaining = nextDay ? weeksRemaining : cronEveryNumbersOfWeeks - 1;
    } else {
      daysRemaining = cronMinWeekDay - actualDay;
    }

    const nextDate = this.dayjsProvider
      .dayjs(actualDate)
      .add(daysRemaining, 'days')
      .add(weeksRemaining, 'weeks')
      .set('seconds', 0)
      .set('minute', 0)
      .set('milliseconds', 0)
      .set('hour', Math.floor(time / 100));

    return nextDate.toDate();
  }
}
