import { TransformFnParams } from 'class-transformer';

export const StringCapitalizeTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (str != '' && !str) return null;

  if (typeof str === 'string') {
    const ignore = ['de', 'da', 'das', 'do', 'dos', 'a', 'e', 'o', 'em'];
    const arrWords = str.replace(/\s+/g, ' ').trim().split(' ');

    for (const i in arrWords) {
      if (ignore.indexOf(arrWords[i]) === -1) {
        arrWords[i] = arrWords[i].charAt(0).toUpperCase() + arrWords[i].slice(1);
      }
    }

    return arrWords.join(' ');
  }

  return null;
};
