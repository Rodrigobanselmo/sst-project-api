import { v4 } from 'uuid';

import { downloadImageFile, getExtensionFromUrl } from './downloadImageFile';

export const downloadPathImage = async (url: string) => {
  if (process.env.NODE_ENV === 'development') return 'images/mock/placeholder-image.png';

  return await downloadImageFile(url, `tmp/${v4()}.${getExtensionFromUrl(url)}`);
};

export const downloadPathImages = async (urls: string[]) => {
  const paths = await Promise.all(
    urls.map(async (url) => {
      return await downloadPathImage(url);
    }),
  );

  return paths;
};
