import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../src/ormConfig';
import { UsersModule } from '../src/users/users.module';
import { TodosModule } from '../src/todos/todos.module';
import { AuthModule } from '../src/auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot(ormConfig),
        UsersModule,
        TodosModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ThrottlerModule.forRoot({
          ttl: 10,
          limit: 5,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

  const body = {
    username: 'test' + randomNumber,
    password: 'test',
    email: `3643766+${randomNumber}@mail.ru`,
  };

  let token: string;
  let userId: number;

  it('auth/registration (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(body)
      .expect(201);
  });

  it('auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: body.username,
        password: body.password,
      });
    const result = response.body;
    expect(result).toEqual({
      accessToken: expect.any(String),
    });
    token = result.accessToken;
  });

  it('Me (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const result = response.body;
    expect(result).toEqual({
      id: expect.any(Number),
      username: expect.any(String),
    });
    userId = result.id;
  });

  it('auth/login Error (POST)', async () => {
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    const body = {
      log: 'test' + randomNumber,
      pass: 'test',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(body)
      .expect(400);
  });

  it('user (DELETE)', async () => {
    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
