import { Test, TestingModule } from '@nestjs/testing';
import { GenerateSourceController } from './generate-source.controller';

describe.skip('GenerateSourceController', () => {
  let controller: GenerateSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateSourceController],
    }).compile();

    controller = module.get<GenerateSourceController>(GenerateSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
