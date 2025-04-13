import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/users.entity';
import { UsersModule } from '@/modules/users/users.module';
import { Role } from '@/shared/enums/role.enum';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('deve criar um novo usuário (POST /users/create)', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/create')
      .send({
        nome: 'Usuário Teste',
        email: `teste${Date.now()}@email.com`,
        senha: '123456',
        funcao: Role.CLIENT,
      })
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Usuário Teste');
    userId = res.body.id;
  });

  it('deve buscar usuários por nome/email/função (GET /users/find/:query)', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/find/teste')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve atualizar um usuário existente (PATCH /users/update/:id)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/update/${userId}`)
      .send({
        nome: 'Nome Atualizado',
        funcao: Role.CLIENT,
      })
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Nome Atualizado');
  });

  afterAll(async () => {
    await app.close();
  });
});
