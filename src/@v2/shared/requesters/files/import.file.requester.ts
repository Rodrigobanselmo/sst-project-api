import { AddFileService } from '@/@v2/files/services/add-file/add-file.service';
import { ReadFileService } from '@/@v2/files/services/read-file/read-file.service';
import { SystemFile } from '../../domain/types/shared/system-file';
import { IFileRequester } from './file.interface';
import { Injectable } from '@nestjs/common';
import { ReadManyFileService } from '@/@v2/files/services/read-many-file/read-many-file.service';

@Injectable()
export class ImportFileRequester implements IFileRequester {
  constructor(
    private readonly addFileService: AddFileService,
    private readonly readFileService: ReadFileService,
    private readonly readManyFileService: ReadManyFileService,
  ) {}

  async read(params: IFileRequester.Read.Params): IFileRequester.Read.Result {
    const [file, error] = await this.readFileService.read(params);

    if (!file || error) return [, error];

    const systemFile = new SystemFile(file);

    return [systemFile, null];
  }

  async readMany(params: IFileRequester.ReadMany.Params): IFileRequester.ReadMany.Result {
    const [files, error] = await this.readManyFileService.read(params);

    if (!files || error) return [, error];

    const systemFile = files.map((file) => new SystemFile(file));

    return [systemFile, null];
  }

  async add(params: IFileRequester.Add.Params): IFileRequester.Add.Result {
    const [file, error] = await this.addFileService.add(params);
    if (!file || error) return [, error];

    const systemFile = new SystemFile(file);

    return [systemFile, null];
  }
}
