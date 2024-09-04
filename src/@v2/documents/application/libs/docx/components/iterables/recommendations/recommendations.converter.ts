import { RecTypeEnum } from '@prisma/client';

import { IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';

export const recommendationsConverter = (riskData: IRiskGroupDataConverter[]) => {
  const remove = ['Não aplicável', 'Não verificada', 'Não implementada'];

  const eng = {
    data: [] as string[],
    title: 'Medidas de Controle de Engenharia',
  };

  const adm = {
    data: [] as string[],
    title: 'Procedimentos de Trabalho e Controles Administrativos',
  };

  const epi = {
    data: [] as string[],
    title: 'Equipamentos de Proteção Individual (Quando aplicável)',
  };

  const others = { data: [] as string[], title: 'Outras Recomendações' };

  riskData.forEach((data) => {
    (data?.riskData.recommendations || []).forEach((rec) => {
      if (remove.includes(rec.name)) return;

      if (rec.type === RecTypeEnum.ENG) {
        if (!eng.data.find((r) => r == rec.name)) eng.data.push(rec.name);
      }
      if (rec.type === RecTypeEnum.ADM) {
        if (!adm.data.find((r) => r == rec.name)) adm.data.push(rec.name);
      }
      if (rec.type === RecTypeEnum.EPI) {
        if (!epi.data.find((r) => r == rec.name)) epi.data.push(rec.name);
      }
      if (!rec.type) {
        if (!others.data.find((r) => r == rec.name)) others.data.push(rec.name);
      }
    });
  });

  return [eng, adm, epi, others];
};
