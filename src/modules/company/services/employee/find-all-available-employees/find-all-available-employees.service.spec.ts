import { Test, TestingModule } from '@nestjs/testing';
import { FindAllAvailableEmployeesService } from './find-all-available-employees.service';

describe.skip('FindAllAvailableEmployeesService', () => {
  let service: FindAllAvailableEmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllAvailableEmployeesService],
    }).compile();

    service = module.get<FindAllAvailableEmployeesService>(FindAllAvailableEmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
