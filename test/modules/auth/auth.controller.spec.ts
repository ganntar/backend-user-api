import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginDto } from '@/modules/auth/guards/dtos/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = { email: 'testuser', senha: 'testpass' };
      const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'testtoken' });

      const result = await authController.login(loginDto);

      expect(loginSpy).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'testtoken' });
    });

    it('should handle errors thrown by AuthService.login', async () => {
      const loginDto: LoginDto = { email: 'testuser', senha: 'testpass' };
      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});