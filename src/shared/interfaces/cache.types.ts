export type ICacheEventBatchType = boolean;
export type ICacheAlertType = boolean;

export enum CacheTtlEnum {
  MIN_1 = 60,
  MIN_6 = 360,
  MIN_10 = 720,
  HOUR_1 = 3600,
  HOUR_3 = 10800,
  HOUR_5 = 18000,
  HOUR_8 = 28800,
  HOUR_12 = 43200,
  HOUR_24 = 86400,
}
