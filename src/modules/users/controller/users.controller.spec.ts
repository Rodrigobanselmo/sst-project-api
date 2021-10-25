import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '../services/create-user/create-user.service';
import { UsersController } from './users.controller';

describe('ControllerController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    expect(await controller.create({} as any)).toEqual({});
  });
});
