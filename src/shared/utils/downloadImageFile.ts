import axios from 'axios';
import fs from 'fs';

export const getExtensionFromUrl = (url: string) => {
  const urlFile = url.split('/');
  return urlFile[urlFile.length - 1].split('.')[1];
};

export const downloadImageFile = (url: string, image_path: string) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise<string>((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve(image_path))
          .on('error', (e) => reject(e));
      }),
  );
