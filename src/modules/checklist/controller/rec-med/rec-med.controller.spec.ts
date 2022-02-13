import { Test, TestingModule } from '@nestjs/testing';
import { RecMedController } from './rec-med.controller';

describe('RecMedController', () => {
  let controller: RecMedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecMedController],
    }).compile();

    controller = module.get<RecMedController>(RecMedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
