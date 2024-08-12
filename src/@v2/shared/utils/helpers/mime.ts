import mime from 'mime-types';

class MimeClass {
  getExtension(contentType: string): string | false {
    return mime.extension(contentType);
  }

  toContentType(extension: string): string | false {
    return mime.contentType(extension);
  }
}

export default MimeClass;
