import { DeleteUnusedFileService } from '@/@v2/files/services/delete-unused-file/delete-unused-document.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUnusedFilesUseCase {
  constructor(private readonly deleteUnusedFileService: DeleteUnusedFileService) {}

  async execute() {
    await this.deleteUnusedFileService.delete();
  }
}
