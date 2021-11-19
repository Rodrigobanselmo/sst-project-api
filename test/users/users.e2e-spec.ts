import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaDbExceptionFilter } from '../../src/shared/filters/prisma-db-exception.filter';
import { FakeInvite } from '../utils/fake/invite.fake';
import { FakerUser } from '../utils/fake/user.fake';
import { AuthModule } from './../../src/modules/auth/auth.module';
import { LoginUserDto } from './../../src/modules/auth/dto/login-user.dto';
import { UsersModule } from './../../src/modules/users/users.module';
import { JwtAuthGuard } from './../../src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from './../../src/shared/guards/permissions.guard';
import { RolesGuard } from './../../src/shared/guards/roles.guard';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;
  const user = new FakerUser();
  delete user.token;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule, AuthModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
        {
          provide: APP_GUARD,
          useClass: PermissionsGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new PrismaDbExceptionFilter());
    await app.init();

    await request(app.getHttpServer()).post('/users').send(user);
  });

  describe('Get ME [GET /me]', () => {
    it('should return user', async () => {
      const sessionUser: LoginUserDto = {
        email: user.email,
        password: user.password,
      };

      const { body: session } = await request(app.getHttpServer())
        .post('/session')
        .send(sessionUser);

      // trying to access route without token
      await request(app.getHttpServer())
        .get('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);

      const userMe = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.OK);

      expect(userMe.body).not.toHaveProperty('password');

      return expect(userMe.body.companies).toEqual([]);
    });
  });

  describe('Create [POST]', () => {
    it('should create User', async () => {
      const createUser = new FakerUser();
      delete createUser.token;

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.CREATED);

      expect(user.body).not.toHaveProperty('password');

      return expect(user.body.companies).toEqual([]);
    });

    it('should not create User with same email', async () => {
      const createUser = new FakerUser({ email: user.email });
      delete createUser.token;

      return await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should validate fields', async () => {
      const createUser = new FakerUser({ email: '123' });
      return await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should validate token', async () => {
      const createUser = new FakerUser();
      return await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should create token and add permissions on create user', async () => {
      const sessionUser: LoginUserDto = {
        email: 'admin@simple.com',
        password: '12345678',
      };

      const { body: session } = await request(app.getHttpServer())
        .post('/session')
        .send(sessionUser)
        .expect(HttpStatus.OK);

      const createInvite = new FakeInvite();

      await request(app.getHttpServer()).post('/invites').send(createInvite);
      await request(app.getHttpServer()).post('/invites').send(createInvite);

      const { body: invite } = await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.CREATED);

      const createUser = new FakerUser({
        token: invite.id,
        email: invite.email,
      });

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.CREATED);

      return expect(user.body.companies).not.toEqual([]);
    });

    it('should not create user if token is assigned to another email or email already exist', async () => {
      const sessionUser: LoginUserDto = {
        email: 'admin@simple.com',
        password: '12345678',
      };

      const { body: session } = await request(app.getHttpServer())
        .post('/session')
        .send(sessionUser)
        .expect(HttpStatus.OK);

      const createInvite = new FakeInvite();

      const { body: invite } = await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.CREATED);

      const createUser = new FakerUser({
        token: invite.id,
      });

      await request(app.getHttpServer())
        .post('/users')
        .send(createUser)
        .expect(HttpStatus.BAD_REQUEST);

      // user already exist in this company
      return await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${session.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .set('Authorization', `Bearer ${refreshSession.token}`)
  //     .expect(HttpStatus.OK)
  //     .then(({ body }) => {
  //       expect(Array.isArray(body)).toBe(true);
  //       expect(body).toEqual(
  //         expect.arrayContaining([
  //           expect.objectContaining({
  //             id: expect.any(Number),
  //             email: expect.any(String),
  //             name: expect.any(String),
  //             created_at: expect.any(String),
  //             roles: expect.arrayContaining([expect.any(String)]),
  //             permissions: expect.arrayContaining([expect.any(String)]),
  //           }),
  //         ]),
  //       );
  //       expect(body).toEqual(
  //         expect.arrayContaining([
  //           expect.not.objectContaining({
  //             password: expect.any(String),
  //           }),
  //         ]),
  //       );
  //     });
  // });

  // it('Update one [PATCH /:id]', async () => {
  //   const createUser: CreateUserDto = newFakeUser();
  //   const sessionUser: LoginUserDto = {
  //     email: createUser.email,
  //     password: createUser.password,
  //   };
  //   const roles_permissions: UpdateUserDto = {
  //     roles: ['admin'],
  //     permissions: ['user.list-all'],
  //   };
  //   await request(app.getHttpServer()).post('/users/create').send(createUser);

  //   const { body: session } = await request(app.getHttpServer())
  //     .post('/auth/session')
  //     .send(sessionUser);

  //   // updating user with non existent value
  //   const { body: updatedUser } = await request(app.getHttpServer())
  //     .patch(`/users/${session.user.id}`)
  //     .set('Authorization', `Bearer ${session.token}`)
  //     .send({ fake: 'value' });

  //   expect(updatedUser.fake).toBeUndefined();

  //   // updating user roles and permissions
  //   return request(app.getHttpServer())
  //     .patch(`/users/${session.user.id}`)
  //     .set('Authorization', `Bearer ${session.token}`)
  //     .send(roles_permissions)
  //     .expect(HttpStatus.OK)
  //     .then(({ body }) => {
  //       expect(body).toEqual(
  //         expect.objectContaining({
  //           id: expect.any(Number),
  //           email: expect.any(String),
  //           name: expect.any(String),
  //           created_at: expect.any(String),
  //           roles: expect.arrayContaining([expect.any(String)]),
  //           permissions: expect.arrayContaining([expect.any(String)]),
  //         }),
  //       );
  //       expect(body).toEqual(
  //         expect.not.objectContaining({
  //           password: expect.any(String),
  //         }),
  //       );
  //     });
  // });

  // it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
