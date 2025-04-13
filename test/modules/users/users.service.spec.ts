// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/users.entity';
import { HttpException } from '@nestjs/common';
import { Role } from '@/shared/enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar um usuário válido', async () => {
    const input = {
      email: 'user@test.com',
      senha: '123456',
      nome: 'Usuário',
      funcao: Role.CLIENT,
    };

    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({ ...input, id: 1 });

    const result = await service.create(input);

    expect(result).toHaveProperty('id');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('deve lançar exceção se função for inválida', async () => {
    const input = { email: 'a@a.com', senha: '123', nome: 'A', funcao: 'invalido' };

    await expect(service.create(input as any)).rejects.toThrow(HttpException);
  });

  it('deve lançar exceção se e-mail já existir', async () => {
    const input = { email: 'user@test.com', senha: '123456', funcao: Role.ADMIN };
    mockRepo.findOne.mockResolvedValue({ id: 1 });

    await expect(service.create(input as any)).rejects.toThrow(HttpException);
  });

  it('deve buscar usuário por e-mail', async () => {
    const user = { id: 1, email: 'a@a.com', senha: 'hash' };
    mockRepo.findOne.mockResolvedValue(user);

    const result = await service.findEmail(user.email);
    expect(result).toEqual(user);
  });

  it('deve lançar erro se e-mail não for encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findEmail('x@x.com')).rejects.toThrow(HttpException);
  });

  it('deve lançar erro se usuário para update não existir', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(HttpException);
  });

  it('deve atualizar usuário válido', async () => {
    const existing = { id: 1, nome: 'Old', email: 'old@test.com', funcao: Role.CLIENT };
    const input = { nome: 'Novo', funcao: Role.CLIENT };

    mockRepo.findOne.mockResolvedValueOnce(existing); // find user
    mockRepo.save.mockResolvedValue({ ...existing, ...input });
    mockRepo.findOne.mockResolvedValueOnce({ ...existing, ...input }); // get updated

    const result = await service.update(1, input as any);

    expect(result).not.toBeNull();
    expect(result!.nome).toBe('Novo');
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
