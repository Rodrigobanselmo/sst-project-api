import fs from 'fs';

import { FileStorage, IStorageProvider } from '../../models/StorageProvider.types';

export class FakeStorageProvider implements IStorageProvider {
  async upload(): Promise<FileStorage.Upload.Result> {
    return { url: ' ', key: ' ' };
  }

  async uploadLarge(): Promise<FileStorage.Upload.Result> {
    return { url: ' ', key: ' ' };
  }

  download(): FileStorage.Download.Result {
    return { file: fs.createReadStream('images/logo/logo-main.png') };
  }

  async delete(): Promise<FileStorage.Delete.Result> {
    return;
  }
}
