/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkNormalize = (value: any) => {
  const transformToString = String(value);

  const treatedString = transformToString
    .replace(/Á/g, 'ç')
    .replace(/«/g, 'ç')
    .replace(/Û/g, 'ó')
    .replace(/”/g, 'ó')
    .replace(/Ù/g, 'ô')
    .replace(/ı/g, 'õ')
    .replace(/’/g, 'õ')
    .replace(/‚/g, 'â')
    .replace(/√/g, 'ã')
    .replace(/„/g, 'ã')
    .replace(/¡/, 'á')
    .replace(/·/g, 'á')
    .replace(/∫/g, 'º')
    .replace(/¡/g, 'á')
    .replace(/¬/g, 'â')
    .replace(/\b,\b/g, 'â')
    .replace(/¿/g, 'à')
    .replace(/‡/g, 'à')
    .replace(/Õ/g, 'í')
    .replace(/Ì/g, 'í')
    .replace(/…/g, 'é')
    .replace(/È/g, 'é')
    .replace(/Í/g, 'è')
    .replace(/⁄/g, 'ú')
    .replace(/˙/g, 'ú')
    .replace(/ì/g, '"')
    .replace(/î/g, '"');

  return treatedString
    .toLocaleLowerCase()
    .replace(/∫ c/g, '°C')
    .replace(/^./, treatedString[0].toUpperCase());
};
//∫ c
