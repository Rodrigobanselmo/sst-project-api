import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeService } from './create-employee.service';

describe('CreateEmployeeService', () => {
  let service: CreateEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateEmployeeService],
    }).compile();

    service = module.get<CreateEmployeeService>(CreateEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
