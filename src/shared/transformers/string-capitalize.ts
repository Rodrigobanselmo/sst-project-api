import { TransformFnParams } from 'class-transformer';

export const StringCapitalizeTransform = (data: TransformFnParams) => {
  const str = data.obj[data.key];

  if (!str) return null;

  if (typeof str === 'string') {
    const ignore = ['de', 'da', 'das', 'do', 'dos', 'a', 'e', 'o'];
    const arrWords = str.split(' ');

    for (const i in arrWords) {
      if (ignore.indexOf(arrWords[i]) === -1) {
        arrWords[i] =
          arrWords[i].charAt(0).toUpperCase() +
          arrWords[i].toLowerCase().slice(1);
      }
    }

    return arrWords.join(' ');
  }

  return null;
};
