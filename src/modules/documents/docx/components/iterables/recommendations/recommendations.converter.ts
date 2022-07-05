import { RecTypeEnum } from '@prisma/client';

import { RiskFactorDataEntity } from './../../../../../checklist/entities/riskData.entity';

export const recommendationsConverter = (
  riskData: Partial<RiskFactorDataEntity>[],
) => {
  const remove = ['Não aplicável', 'Não identificada', 'Não informada'];

  // eslint-disable-next-line prettier/prettier
  const eng = { data: [] as string[], title: 'Medidas de Controle de Engenharia' };
  // eslint-disable-next-line prettier/prettier
  const adm = { data: [] as string[], title: 'Procedimentos de Trabalho e Controles Administrativos'}
  // eslint-disable-next-line prettier/prettier
  const epi = { data: [] as string[], title: 'Equipamentos de Proteção Individual (Quando aplicável)'}
  // eslint-disable-next-line prettier/prettier
  const others = { data: [] as string[], title: 'Outras Recomendações'}


  riskData.forEach((data) => {
    (data?.recs || []).forEach((rec) => {
      if (remove.includes(rec.recName)) return;

      if (rec.recType === RecTypeEnum.ENG) {
        if (!eng.data.find((r) => r == rec.recName)) eng.data.push(rec.recName);
      }
      if (rec.recType === RecTypeEnum.ADM) {
        if (!adm.data.find((r) => r == rec.recName)) adm.data.push(rec.recName);
      }
      if (rec.recType === RecTypeEnum.EPI) {
        if (!epi.data.find((r) => r == rec.recName)) epi.data.push(rec.recName);
      }
      if (!rec.recType) {
        if (!others.data.find((r) => r == rec.recName))
          others.data.push(rec.recName);
      }
    });
  });

  return [eng, adm, epi, others];
};
