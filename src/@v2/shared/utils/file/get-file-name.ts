import dayjs from 'dayjs';

export function getFileName(name: string) {
  const newFileName = `${dayjs().format('DD_MM_YY_HH_mm_ss')}_${name}`;
  return newFileName;
}
