import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { dayjs } from 'src/shared/providers/DateProvider/implementations/DayJSProvider';
import { IPublicFormParticipantLoginUseCase } from './public-form-participant-login.types';

@Injectable()
export class PublicFormParticipantLoginUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationRepository: FormApplicationAggregateRepository,
    private readonly formParticipantsDAO: FormParticipantsDAO,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async execute(params: IPublicFormParticipantLoginUseCase.Params): Promise<IPublicFormParticipantLoginUseCase.Return> {
    // First, check if the form application exists and can be answered
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new BadRequestException('Formulário não encontrado');
    }

    if (!formApplication.formApplication.canBeAnswered()) {
      throw new BadRequestException('Este formulário não está disponível para preenchimento');
    }

    // Parse the birthday string to Date using dayjs with timezone handling
    const birthdayDate = dayjs(params.birthday).tz('America/Sao_Paulo', true);

    // Validate date format
    if (!birthdayDate.isValid()) {
      throw new BadRequestException('Data de aniversário inválida');
    }

    // Create start and end of day in São Paulo timezone, then convert to UTC for database query
    const startOfDay = birthdayDate.startOf('day').utc().toDate();
    const endOfDay = birthdayDate.endOf('day').utc().toDate();

    const employee = await this.prisma.employee.findFirst({
      where: {
        cpf: params.cpf,
        companyId: formApplication.formApplication.companyId, // Filter by form's company
        birthday: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        companyId: true,
      },
    });

    if (!employee) {
      throw new BadRequestException('CPF ou data de nascimento incorretos. Verifique os dados e tente novamente.');
    }

    const participants = await this.formParticipantsDAO.browse({
      page: 1,
      limit: 1,
      filters: {
        companyId: employee.companyId,
        applicationId: params.applicationId,
        employeeIds: [employee.id],
      },
      cryptoAdapter: this.cryptoAdapter,
    });

    if (!participants.results.length) {
      throw new BadRequestException('Usuário não autorizado para responder este formulário');
    }

    return employee;
  }
}
