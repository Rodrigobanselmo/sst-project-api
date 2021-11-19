import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '../../services/users/create-user/create-user.service';
import { FindByEmailService } from '../../services/users/find-by-email/find-by-email.service';
import { FindByIdService } from '../../services/users/find-by-id/find-by-id.service';
import { ResetPasswordService } from '../../services/users/reset-password/reset-password.service';
import { UpdateUserService } from '../../services/users/update-user/update-user.service';
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
        {
          provide: UpdateUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ResetPasswordService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: FindByEmailService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: FindByIdService,
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
