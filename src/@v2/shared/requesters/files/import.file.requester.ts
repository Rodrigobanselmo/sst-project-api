import { AddFileService } from '@/@v2/files/services/add-file/add-file.service';
import { ReadFileService } from '@/@v2/files/services/read-file/read-file.service';
import { SystemFile } from '../../domain/types/shared/system-file';
import { IFileRequester } from './file.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportFileRequester implements IFileRequester {
  constructor(
    private readonly addFileService: AddFileService,
    private readonly readFileService: ReadFileService,
  ) {}

  async read(params: IFileRequester.Read.Params): IFileRequester.Read.Result {
    const [file, error] = await this.readFileService.read(params);

    if (!file || error) return [, error];

    const systemFile = new SystemFile(file);

    return [systemFile, null];
  }

  async add(params: IFileRequester.Add.Params): IFileRequester.Add.Result {
    const [file, error] = await this.addFileService.add(params);
    if (!file || error) return [, error];

    const systemFile = new SystemFile(file);

    return [systemFile, null];
  }
}
