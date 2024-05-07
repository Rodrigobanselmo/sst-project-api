export enum AppendixEnum {
  NOISE = 1,
  NOISE_IMPACT = 2,
  HEAT = 3,
  RADIATION = 5,
  PRESSURE = 6,
  NON_IONIZING_RAD = 7,
  VIBRATION = 8,
  COLD = 9,
  HUMIDITY = 10,
  CHEMICAL_NR_15 = 11,
  DUST = 12,
  CHEMICAL = 13,
  BIO = 14,
  ACI = 'A',
  ERG = 'E',
  OUTROS = 'N',
}

export enum OtherAppendixEnum {
  ACGH = 'ACGH',
  NR_16_APPENDIX_1 = 'NR 16 Anexo 1',
  NR_16_APPENDIX_2 = 'NR 16 Anexo 2',
  NR_16_APPENDIX_3 = 'NR 16 Anexo 3',
  NR_16_APPENDIX_4 = 'NR 16 Anexo 4',
  NR_16_APPENDIX_5 = 'NR 16 Anexo 5',
  IONIZING_RAD_PERICULOSITY = 'Portaria nº 518/2003',
}

export const AppendixEnumMap: Record<AppendixEnum, { name: string; rsData: string | number }> = {
  [AppendixEnum.NOISE]: { name: 'Anexo 1', rsData: 1 },
  [AppendixEnum.NOISE_IMPACT]: { name: 'Anexo 2', rsData: 2 },
  [AppendixEnum.HEAT]: { name: 'Anexo 3', rsData: 3 },
  [AppendixEnum.RADIATION]: { name: 'Anexo 5', rsData: 5 },
  [AppendixEnum.PRESSURE]: { name: 'Anexo 6', rsData: 6 },
  [AppendixEnum.NON_IONIZING_RAD]: { name: 'Anexo 7', rsData: 7 },
  [AppendixEnum.VIBRATION]: { name: 'Anexo 8', rsData: 8 },
  [AppendixEnum.COLD]: { name: 'Anexo 9', rsData: 9 },
  [AppendixEnum.HUMIDITY]: { name: 'Anexo 10', rsData: 10 },
  [AppendixEnum.CHEMICAL_NR_15]: { name: 'Anexo 11', rsData: 11 },
  [AppendixEnum.DUST]: { name: 'Anexo 12', rsData: 12 },
  [AppendixEnum.CHEMICAL]: { name: 'Anexo 13', rsData: 13 },
  [AppendixEnum.BIO]: { name: 'Anexo 14', rsData: 14 },
  [AppendixEnum.ACI]: { name: 'Riscos de Acidentes', rsData: 'A' },
  [AppendixEnum.ERG]: { name: 'Riscos Ergonomicos', rsData: 'E' },
  [AppendixEnum.OUTROS]: { name: 'Riscos não relacionados', rsData: 'N' },
}

export const OtherAppendixEnumMap: Record<OtherAppendixEnum, { name: string; rsData: string | number }> = {
  [OtherAppendixEnum.ACGH]: { name: 'ACGH', rsData: 'ACGH' },
  [OtherAppendixEnum.NR_16_APPENDIX_1]: { name: 'NR 16 Anexo 1', rsData: 15 },
  [OtherAppendixEnum.NR_16_APPENDIX_2]: { name: 'NR 16 Anexo 2', rsData: 16 },
  [OtherAppendixEnum.NR_16_APPENDIX_3]: { name: 'NR 16 Anexo 3', rsData: 17 },
  [OtherAppendixEnum.NR_16_APPENDIX_4]: { name: 'NR 16 Anexo 4', rsData: 18 },
  [OtherAppendixEnum.NR_16_APPENDIX_5]: { name: 'NR 16 Anexo 5', rsData: 19 },
  [OtherAppendixEnum.IONIZING_RAD_PERICULOSITY]: { name: "Portaria nº 518/2003", rsData: 20 },
}