import { Test, TestingModule } from '@nestjs/testing';
import { FilesCompanyController } from './files-company.controller';

describe('FilesCompanyController', () => {
  let controller: FilesCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesCompanyController],
    }).compile();

    controller = module.get<FilesCompanyController>(FilesCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
