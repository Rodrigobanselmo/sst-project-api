import { MeasuresTypeEnum, Prisma, RecTypeEnum, StatusEnum } from '@prisma/client';

export type SyncDerivedMeasureFromDonePlanParams = {
  riskFactorDataRecId: string;
  riskFactorDataId: string;
  recommendationId: string;
  workspaceId: string;
  companyId: string;
  /**
   * Quando true, não lança se a recomendação não estiver na junção deste risco-dado (fluxo legado / inconsistência).
   */
  skipIfUnlinked?: boolean;
  /**
   * Fluxo retroativo (ex.: após PATCH /rec-med com `recType`): se não existir `RecMedOnRiskData`,
   * aceita o próprio `RiskFactorDataRec` DONE (mesmo id / recMedId / riskFactorDataId / companyId dos params)
   * como prova de vínculo, em vez de abortar quando `skipIfUnlinked` está true.
   */
  trustPlanRowOverRecMedOnRiskData?: boolean;
};

const VALID_REC_TYPES: RecTypeEnum[] = [RecTypeEnum.ENG, RecTypeEnum.ADM, RecTypeEnum.EPI];

function resolveDestinationMedType(params: {
  recType?: RecTypeEnum | null;
  medType?: MeasuresTypeEnum | null;
}): MeasuresTypeEnum | null {
  if (params.recType && VALID_REC_TYPES.includes(params.recType)) {
    return params.recType === RecTypeEnum.ENG ? MeasuresTypeEnum.ENG : MeasuresTypeEnum.ADM;
  }

  // Legacy fallback: alguns cadastros antigos têm `medType` preenchido e `recType` nulo.
  if (params.medType === MeasuresTypeEnum.ENG || params.medType === MeasuresTypeEnum.ADM) {
    return params.medType;
  }

  // Compatibilidade com base legada: recomendações antigas podem não ter tipagem.
  // Para não bloquear a materialização após DONE, assume controle administrativo.
  if (!params.recType && !params.medType) {
    return MeasuresTypeEnum.ADM;
  }

  return null;
}

async function ensureDerivedMeasureMaterialized(
  tx: Prisma.TransactionClient,
  params: {
    riskFactorDataId: string;
    derivedRecMedId: string;
    destinationMedType: MeasuresTypeEnum;
    companyId: string;
  },
): Promise<void> {
  if (params.destinationMedType === MeasuresTypeEnum.ENG) {
    await tx.engsToRiskFactorData.upsert({
      where: {
        riskFactorDataId_recMedId: {
          riskFactorDataId: params.riskFactorDataId,
          recMedId: params.derivedRecMedId,
        },
      },
      create: {
        riskFactorDataId: params.riskFactorDataId,
        recMedId: params.derivedRecMedId,
      },
      update: {},
    });
    return;
  }

  const alreadyConnectedAdm = await tx.riskFactorData.findFirst({
    where: {
      id: params.riskFactorDataId,
      adms: {
        some: {
          id: params.derivedRecMedId,
          companyId: params.companyId,
        },
      },
    },
    select: { id: true },
  });

  if (alreadyConnectedAdm) {
    return;
  }

  await tx.riskFactorData.update({
    where: { id: params.riskFactorDataId },
    data: {
      adms: {
        connect: {
          id_companyId: {
            id: params.derivedRecMedId,
            companyId: params.companyId,
          },
        },
      },
    },
  });
}

/**
 * Cria medida derivada para item do plano já DONE, se ainda não existir e se a recomendação
 * tiver classificação de destino válida (`recType` ou fallback legado por `medType`).
 * Idempotente (derivada única por `riskFactorDataRecId`). Não altera status nem comentários do plano.
 */
export async function syncDerivedMeasureFromDonePlanIfMissing(
  tx: Prisma.TransactionClient,
  params: SyncDerivedMeasureFromDonePlanParams,
): Promise<void> {
  await tx.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(CAST(${params.riskFactorDataRecId} AS text)))`);

  const existing = await tx.riskFactorDataRecDerivedMeasure.findUnique({
    where: { riskFactorDataRecId: params.riskFactorDataRecId },
    select: {
      derivedRecMedId: true,
      destinationMedType: true,
    },
  });
  if (existing) {
    await ensureDerivedMeasureMaterialized(tx, {
      riskFactorDataId: params.riskFactorDataId,
      derivedRecMedId: existing.derivedRecMedId,
      destinationMedType: existing.destinationMedType,
      companyId: params.companyId,
    });
    return;
  }

  const dataRec = await tx.riskFactorDataRec.findUnique({
    where: { id: params.riskFactorDataRecId },
    select: {
      status: true,
      recMedId: true,
      riskFactorDataId: true,
      companyId: true,
    },
  });
  if (!dataRec || dataRec.status !== StatusEnum.DONE) {
    return;
  }

  const planRowMatchesParams =
    dataRec.recMedId === params.recommendationId &&
    dataRec.riskFactorDataId === params.riskFactorDataId &&
    dataRec.companyId === params.companyId;

  const sourceRecMed = await tx.recMed.findUnique({
    where: { id: params.recommendationId },
    select: {
      id: true,
      riskId: true,
      recName: true,
      medName: true,
      recType: true,
      medType: true,
    },
  });

  const destinationMedType = resolveDestinationMedType({
    recType: sourceRecMed?.recType,
    medType: sourceRecMed?.medType,
  });

  if (!sourceRecMed || !destinationMedType) {
    return;
  }

  const sourceOnRiskData = await tx.recMedOnRiskData.findUnique({
    where: {
      rec_med_id_risk_data_id: {
        rec_med_id: params.recommendationId,
        risk_data_id: params.riskFactorDataId,
      },
    },
    select: { rec_med_id: true },
  });

  if (!sourceOnRiskData) {
    const linkedByPlanRow =
      !!params.trustPlanRowOverRecMedOnRiskData && planRowMatchesParams;
    if (!linkedByPlanRow) {
      if (params.skipIfUnlinked) {
        return;
      }
      throw new Error(
        'Etapa 1 — derivação cancelada: a recomendação não está vinculada a este risco-dado (tabela de junção esperada pelo plano).',
      );
    }
  }

  const derivedMedType = destinationMedType;
  const medLabel = sourceRecMed.recName ?? sourceRecMed.medName ?? '';

  const derivedRecMed = await tx.recMed.create({
    data: {
      riskId: sourceRecMed.riskId,
      companyId: params.companyId,
      medName: medLabel,
      medType: derivedMedType,
      system: false,
      status: StatusEnum.ACTIVE,
    },
  });

  if (destinationMedType === MeasuresTypeEnum.ENG) {
    await tx.engsToRiskFactorData.upsert({
      where: {
        riskFactorDataId_recMedId: {
          riskFactorDataId: params.riskFactorDataId,
          recMedId: derivedRecMed.id,
        },
      },
      create: {
        riskFactorDataId: params.riskFactorDataId,
        recMedId: derivedRecMed.id,
      },
      update: {},
    });
  } else {
    await tx.riskFactorData.update({
      where: { id: params.riskFactorDataId },
      data: {
        adms: {
          connect: {
            id_companyId: {
              id: derivedRecMed.id,
              companyId: params.companyId,
            },
          },
        },
      },
    });
  }

  await tx.riskFactorDataRecDerivedMeasure.create({
    data: {
      riskFactorDataRecId: params.riskFactorDataRecId,
      sourceRecMedId: sourceRecMed.id,
      derivedRecMedId: derivedRecMed.id,
      riskFactorDataId: params.riskFactorDataId,
      workspaceId: params.workspaceId,
      companyId: params.companyId,
      destinationMedType,
      sourceRecType: sourceRecMed.recType,
    },
  });
}
