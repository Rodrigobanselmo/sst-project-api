interface IPercentageCheckParams {
  value?: string, limit?: string, maxLimitMultiplier?: number
}

export function percentageCheck({ limit, value, maxLimitMultiplier }: IPercentageCheckParams) {
  if (!value || !limit) return 0;

  value = value.replace(/[^0-9.]/g, '');
  limit = limit.replace(/[^0-9.]/g, '');

  const stage = Number(value) / Number(limit);
  if (stage < 0.1) return 1;
  if (stage < 0.25) return 2;
  if (stage < 0.5) return 3;
  if (stage < 1) return 4;
  if (maxLimitMultiplier && stage > maxLimitMultiplier) return 6;
  return 5;
}