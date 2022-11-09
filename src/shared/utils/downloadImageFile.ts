import axios from 'axios';
import fs from 'fs';

export const getExtensionFromUrl = (url: string) => {
  if (!url) return '';

  const urlFile = url.split('/');
  return urlFile[urlFile.length - 1].split('.')[1];
};

export const downloadImageFile = async (
  url: string | null,
  image_path: string,
): Promise<string | null> => {
  if (!url) return null;

  return axios({
    url,
    responseType: 'stream',
  })
    .then(
      (response) =>
        new Promise<string>((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(image_path))
            .on('finish', () => resolve(image_path))
            .on('error', (e) => reject(e));
        }),
    )
    .catch((e) => {
      console.log('downloadImageFile', e);
      return null;
    });
};
