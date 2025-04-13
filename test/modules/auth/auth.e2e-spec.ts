import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/users.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) deve autenticar com sucesso', async () => {
    // Primeiro cria o usuário
    await request(app.getHttpServer()).post('/users/create').send({
      nome: 'Tester',
      email: 'test@e2e.com',
      senha: '123456',
      funcao: 'client',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@e2e.com', senha: '123456' })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
  });

  afterAll(async () => {
    await app.close();
  });
});
