import mime from 'mime-types';

export function getExtension(contentType: string): string | false {
  return mime.extension(contentType);
}
