import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { DayJSProvider } from './DayJSProvider';

describe('DayJSProvider', () => {
  let dayJSProvider: DayJSProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayJSProvider],
    }).compile();

    dayJSProvider = module.get<DayJSProvider>(DayJSProvider);
  });

  it('should be defined', () => {
    expect(dayJSProvider).toBeDefined();
  });

  it('should return a date value (dateNow)', () => {
    expect(dayJSProvider.dateNow()).toBeInstanceOf(Date);
  });

  it('should return a date value (convertToUTC)', () => {
    expect(dayJSProvider.convertToUTC(new Date())).not.toBeUndefined();
  });

  it('should add one second to a date (addSeconds)', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addSeconds(date, 1);
    const diffSeconds = newDate.getTime() - date.getTime();
    expect(diffSeconds).toEqual(1000);
  });

  it('should add one hour to a date (addHours)', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addHours(date, 1);
    const diffSeconds = newDate.getTime() - date.getTime();
    expect(diffSeconds).toEqual(1000 * 60 * 60);
  });

  it('should add one day to a date (addDay)', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addDay(date, 1);
    const diffSeconds = newDate.getTime() - date.getTime();
    expect(diffSeconds).toEqual(1000 * 60 * 60 * 24);
  });

  it('should add one any time to a date (by seconds, minutes, hours, ...)', () => {
    const date = dayJSProvider.dateNow();
    const addSeconds =
      dayJSProvider.addTime(date, 1, 's').getTime() - date.getTime();
    const addMinutes =
      dayJSProvider.addTime(date, 1, 'm').getTime() - date.getTime();
    const addHours =
      dayJSProvider.addTime(date, 1, 'h').getTime() - date.getTime();
    const addDays =
      dayJSProvider.addTime(date, 1, 'd').getTime() - date.getTime();
    const addWeeks =
      dayJSProvider.addTime(date, 1, 'w').getTime() - date.getTime();
    const addMonths =
      dayJSProvider.addTime(date, 1, 'M').getTime() - date.getTime();
    const addYears =
      dayJSProvider.addTime(date, 1, 'y').getTime() - date.getTime();

    const day = 1000 * 60 * 60 * 24;

    expect(addSeconds).toEqual(1000);
    expect(addMinutes).toEqual(1000 * 60);
    expect(addHours).toEqual(1000 * 60 * 60);
    expect(addDays).toEqual(day);
    expect(addWeeks).toEqual(day * 7);
    expect(addMonths).toBeGreaterThanOrEqual(day * 27);
    expect(addMonths).toBeLessThanOrEqual(day * 31);
    expect(addYears).toEqual(day * 365);
  });

  it('should see if date is before', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addDay(date, 1);

    const dateIsBefore = dayJSProvider.compareIfBefore(date, newDate);
    const newDateIsBefore = dayJSProvider.compareIfBefore(newDate, date);

    expect(dateIsBefore).toEqual(true);
    expect(newDateIsBefore).toEqual(false);
  });

  it('should compare time', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addDay(date, 1);

    const compareInDay = dayJSProvider.compareTime(date, newDate, 'd');
    const compareInHours = dayJSProvider.compareTime(date, newDate, 'h');

    expect(compareInDay).toEqual(1);
    expect(compareInHours).toEqual(24);
  });

  it('should compare time', () => {
    const date = dayJSProvider.dateNow();
    const newDate = dayJSProvider.addDay(date, 1);

    const compareInDay = dayJSProvider.compareTime(date, newDate, 'd');
    const compareInHours = dayJSProvider.compareTime(date, newDate, 'h');

    expect(compareInDay).toEqual(1);
    expect(compareInHours).toEqual(24);
  });
});
