import { Test, TestingModule } from '@nestjs/testing';
import { FilesChecklistController } from './files-checklist.controller';

describe('FilesController', () => {
  let controller: FilesChecklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesChecklistController],
    }).compile();

    controller = module.get<FilesChecklistController>(FilesChecklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
