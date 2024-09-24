import mime from 'mime-types';

export function getContentType(extension: string): string | false {
  return mime.contentType(extension);
}

