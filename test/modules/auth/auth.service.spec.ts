import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { UsersService } from '../../../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '@/shared/enums/role.enum';
import { User } from '@/modules/users/users.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should return an access token if login is successful', async () => {
    const mockUser = { id: 1, email: 'test@example.com', senha: 'hashedPassword', nome: 'Test User', funcao: Role.ADMIN };
    const loginDto = { email: 'test@example.com', senha: 'password' };

    jest.spyOn(usersService, 'findEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockAccessToken');

    const result = await authService.login(loginDto);

    expect(usersService.findEmail).toHaveBeenCalledWith(loginDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.senha, mockUser.senha);
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, username: mockUser.email });
    expect(result).toEqual({ access_token: 'mockAccessToken' });
  });

  it('should throw NOT_FOUND if user does not exist', async () => {
    const loginDto = { email: 'nonexistent@example.com', senha: 'password' };

    jest.spyOn(usersService, 'findEmail').mockResolvedValue(null);

    await expect(authService.login(loginDto)).rejects.toThrow(
      new HttpException('Usuario não existe!', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw UNAUTHORIZED if password is invalid', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      senha: 'hashedpassword',
      nome: 'Test User',
      funcao: Role.CLIENT,
    };
    const loginDto = { email: 'test@example.com', senha: 'wrongPassword' };

    jest.spyOn(usersService, 'findEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

    await expect(authService.login(loginDto)).rejects.toThrow(
      new HttpException('Senha Invalida!', HttpStatus.UNAUTHORIZED),
    );
  });
});