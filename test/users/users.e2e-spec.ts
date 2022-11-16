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
import { User } from '.prisma/client';

describe('[Feature] Users - /users', () => {
  let app: INestApplication;
  let sessionAdmin: { token: string; user: User; refresh_token: string };
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
    const sessionUser: LoginUserDto = {
      email: 'admin@simple.com',
      password: '12345678',
    };

    const data = await request(app.getHttpServer()).post('/session').send(sessionUser);

    sessionAdmin = data.body;
  });

  describe('Get ME [GET /me]', () => {
    it('should return user', async () => {
      const sessionUser: LoginUserDto = {
        email: user.email,
        password: user.password,
      };

      const { body: session } = await request(app.getHttpServer()).post('/session').send(sessionUser);

      // trying to access route without token
      await request(app.getHttpServer()).get('/users/me').expect(HttpStatus.UNAUTHORIZED);

      const userMe = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${session.token}`).expect(HttpStatus.OK);

      expect(userMe.body).not.toHaveProperty('password');

      return expect(userMe.body.companies).toEqual([]);
    });
  });

  describe('Create [POST]', () => {
    it('should create User', async () => {
      const createUser = new FakerUser();
      delete createUser.token;

      const user = await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.CREATED);

      expect(user.body).not.toHaveProperty('password');

      return expect(user.body.companies).toEqual([]);
    });

    it('should not create User with same email', async () => {
      const createUser = new FakerUser({ email: user.email });
      delete createUser.token;

      return await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.BAD_REQUEST);
    });

    it('should validate fields', async () => {
      const createUser = new FakerUser({ email: '123' });
      return await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.BAD_REQUEST);
    });

    it('should validate token', async () => {
      const createUser = new FakerUser({ token: '123' });
      return await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.BAD_REQUEST);
    });

    it('should create token and add permissions on create user', async () => {
      const createInvite = new FakeInvite();

      const { body: invite } = await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.CREATED);

      const createUser = new FakerUser({
        token: invite.id,
        email: invite.email,
      });

      const user = await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.CREATED);

      return expect(user.body.companies).not.toEqual([]);
    });

    it('should not create user if token is assigned to another email or email already exist', async () => {
      const createInvite = new FakeInvite();

      const { body: invite } = await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.CREATED);

      const createUser = new FakerUser({
        token: invite.id,
      });

      await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.BAD_REQUEST);

      const createUserInvite = new FakerUser({
        email: invite.email,
        token: invite.id,
      });

      await request(app.getHttpServer()).post('/users').send(createUserInvite).expect(HttpStatus.CREATED);

      // user already exist in this company
      return await request(app.getHttpServer()).post('/invites').send(createInvite).set('Authorization', `Bearer ${sessionAdmin.token}`).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Update one [PATCH]', () => {
    it('Update user', async () => {
      const createUser = new FakerUser();

      delete createUser.token;

      const sessionUser = {
        email: createUser.email,
        password: createUser.password,
      };

      await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.CREATED);

      const { body: session } = await request(app.getHttpServer()).post('/session').send(sessionUser).expect(HttpStatus.OK);

      return request(app.getHttpServer())
        .patch(`/users/update`)
        .set('Authorization', `Bearer ${session.token}`)
        .send({ email: 'user@gmail.com' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              email: expect.any(String),
            }),
          );
          expect(body.password).toBeUndefined();
        });
    });

    it('Update user password or fail if incorrect', async () => {
      const createUser = new FakerUser();

      delete createUser.token;

      const sessionUser = {
        email: createUser.email,
        password: createUser.password,
      };

      await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.CREATED);

      const { body: session } = await request(app.getHttpServer()).post('/session').send(sessionUser).expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .patch(`/users/update`)
        .set('Authorization', `Bearer ${session.token}`)
        .send({
          password: '1234567890',
          oldPassword: 'incorrect',
        })
        .expect(HttpStatus.BAD_REQUEST);

      return request(app.getHttpServer())
        .patch(`/users/update`)
        .set('Authorization', `Bearer ${session.token}`)
        .send({
          password: '1234567890',
          oldPassword: createUser.password,
        })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              email: expect.any(String),
            }),
          );
          expect(body.password).toBeUndefined();
        });
    });

    it('Update user roles and permissions by token', async () => {
      const createUser = new FakerUser();

      delete createUser.token;

      const sessionUser = {
        email: createUser.email,
        password: createUser.password,
      };

      await request(app.getHttpServer()).post('/users').send(createUser).expect(HttpStatus.CREATED);

      const { body: session } = await request(app.getHttpServer()).post('/session').send(sessionUser).expect(HttpStatus.OK);

      const createInvite = new FakeInvite({ email: createUser.email });

      const { body: invite } = await request(app.getHttpServer())
        .post('/invites')
        .send(createInvite)
        .set('Authorization', `Bearer ${sessionAdmin.token}`)
        .expect(HttpStatus.CREATED);

      return request(app.getHttpServer())
        .patch(`/users/update`)
        .set('Authorization', `Bearer ${session.token}`)
        .send({ token: invite.id })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.companies[0].permissions).toEqual(createInvite.permissions);
          expect(body.companies[0].roles).toEqual(createInvite.roles);
        });
    });
  });

  it.todo('Reset password [PATCH /reset-password]');

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

  // it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
