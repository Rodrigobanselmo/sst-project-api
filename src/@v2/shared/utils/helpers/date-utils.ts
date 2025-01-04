import dayjs from 'dayjs'

class DateUtils extends Date {
  constructor(date: Date | string | number = new Date()) {
    super(date)
  }

  static builder(date = new Date()) {
    return new DateUtils(date)
  }

  format(template: string) {
    return dayjs(this).format(template)
  }

  addMonths(months: number) {
    return dayjs(this).add(months, 'month').toDate()
  }
}

export const dateUtils = (date?: Date) => {
  return DateUtils.builder(date)
}
