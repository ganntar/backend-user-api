import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersService } from '@/modules/users/users.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({ secret: 'test', signOptions: { expiresIn: '1h' } }),
      ],
    })
    .overrideProvider(UsersService)
    .useValue({
      findEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'user@test.com',
        senha: await require('bcrypt').hash('123456', 10),
      }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) deve retornar token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@test.com', senha: '123456' })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });

  afterAll(async () => {
    await app.close();
  });
});
