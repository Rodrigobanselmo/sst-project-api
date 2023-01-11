import { ClinicScheduleTypeEnum, CompanyPaymentTypeEnum } from '@prisma/client';

export const clinicScheduleMap = {
  [ClinicScheduleTypeEnum.PHONE]: {
    value: ClinicScheduleTypeEnum.PHONE,
    name: 'Telefone',
  },
  [ClinicScheduleTypeEnum.EMAIL]: {
    value: ClinicScheduleTypeEnum.EMAIL,
    name: 'Email',
  },
  [ClinicScheduleTypeEnum.ONLINE]: {
    value: ClinicScheduleTypeEnum.ONLINE,
    name: 'Online (Sistema)',
  },
  [ClinicScheduleTypeEnum.ASK]: {
    value: ClinicScheduleTypeEnum.ASK,
    name: 'Pedido de Agenda (Sistema)',
  },
  [ClinicScheduleTypeEnum.NONE]: {
    value: ClinicScheduleTypeEnum.NONE,
    name: 'Sem Agendamento',
  },
};

export const companyPaymentScheduleMap = {
  [CompanyPaymentTypeEnum.ANTICIPATED]: {
    value: CompanyPaymentTypeEnum.ANTICIPATED,
    name: 'Depósito antecipado',
  },
  [CompanyPaymentTypeEnum.DEBIT]: {
    value: CompanyPaymentTypeEnum.DEBIT,
    name: 'Faturamento',
  },
};
