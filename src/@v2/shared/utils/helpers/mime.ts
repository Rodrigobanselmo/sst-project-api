import mime from 'mime-types';

export function getExtension(contentType: string): string | false {
  return mime.extension(contentType);
}

export function toContentType(extension: string): string | false {
  return mime.contentType(extension);
}

