export function ExcelDateToJSDate(serialDate: number) {
  const hours = Math.floor((serialDate % 1) * 24);
  const minutes = Math.floor(((serialDate % 1) * 24 - hours) * 60);
  return new Date(Date.UTC(0, 0, serialDate, hours - 21, minutes));
}
