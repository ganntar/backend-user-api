import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@/shared/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('fake-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve retornar token se login for válido', async () => {
    const user = { id: 1, email: 'test@test.com', senha: await bcrypt.hash('123456', 10), nome: 'Test User', funcao: 'User' as Role };
    jest.spyOn(usersService, 'findEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.login({ email: user.email, senha: '123456' });

    expect(result).toHaveProperty('access_token');
  });

  it('deve lançar exceção se usuário não existir', async () => {
    jest.spyOn(usersService, 'findEmail').mockResolvedValue(null);

    await expect(service.login({ email: 'x@test.com', senha: '123' }))
      .rejects.toThrow(HttpException);
  });

  it('deve lançar exceção se senha for inválida', async () => {
    const user = { id: 1, email: 'test@test.com', senha: await bcrypt.hash('123456', 10), nome: 'Test User', funcao: 'User' as Role };
    jest.spyOn(usersService, 'findEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(service.login({ email: 'test@test.com', senha: 'errada' }))
      .rejects.toThrow(HttpException);
  });
});
