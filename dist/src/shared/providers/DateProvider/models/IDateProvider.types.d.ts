declare type UnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms' | 'w';
declare type UnitTypeLong = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'week';
declare type UnitTypeLongPlural = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years' | 'weeks';
declare type ManipulateType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;
interface IDateProvider {
    compareTime(start_date: Date, end_date: Date, compareIn: ManipulateType): number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    addHours(date: Date, hours: number): Date;
    addDay(date: Date, days: number): Date;
    addTime(date: Date, value: number, type: ManipulateType): Date;
    compareIfBefore(start_date: Date, end_date: Date): boolean;
}
export { IDateProvider, ManipulateType };
