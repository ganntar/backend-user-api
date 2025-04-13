import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/modules/users/users.entity';
import { Role } from '@/shared/enums/role.enum';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    createQueryBuilder: any;
  };

  beforeEach(async () => {
    mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar um usuário válido', async () => {
    const dto = {
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456',
      funcao: Role.CLIENT,
    };

    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({ ...dto, id: 1 });

    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('deve lançar exceção se a função for inválida', async () => {
    const dto = {
      nome: 'Inválido',
      email: 'x@x.com',
      senha: '123456',
      funcao: 'gerente', // inválido
    };

    await expect(service.create(dto as any)).rejects.toThrow(HttpException);
  });

  it('deve lançar exceção se o e-mail já existir', async () => {
    const dto = {
      nome: 'Duplicado',
      email: 'existe@teste.com',
      senha: '123456',
      funcao: Role.CLIENT,
    };

    mockRepo.findOne.mockResolvedValue({ id: 99 });

    await expect(service.create(dto)).rejects.toThrow(HttpException);
  });

  it('deve retornar usuário por e-mail', async () => {
    const user = { id: 1, email: 'user@teste.com', senha: 'hash' };
    mockRepo.findOne.mockResolvedValue(user);

    const result = await service.findEmail(user.email);
    expect(result).toEqual(user);
  });

  it('deve lançar erro se e-mail não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.findEmail('x@x.com')).rejects.toThrow(HttpException);
  });

  it('deve executar busca com termo', async () => {
    const fakeUsers = [{ id: 1, nome: 'teste', email: 'x@x.com' }];
    mockRepo.createQueryBuilder().getMany.mockResolvedValue(fakeUsers);

    const result = await service.find('test');
    expect(Array.isArray(result)).toBe(true);
    expect(result?.length).toBeGreaterThan(0);
  });

  it('deve atualizar usuário válido', async () => {
    const existing = {
      id: 1,
      nome: 'Antigo',
      email: 'old@teste.com',
      funcao: Role.CLIENT,
    };

    const dto = {
      nome: 'Novo Nome',
      funcao: Role.CLIENT,
    };

    mockRepo.findOne
      .mockResolvedValueOnce(existing) // primeiro findOne (buscar existente)
      .mockResolvedValueOnce({ ...existing, ...dto }); // segundo findOne (retornar atualizado)

    mockRepo.save.mockResolvedValue({ ...existing, ...dto });

    const result = await service.update(1, dto as any);
    expect(result?.nome).toBe(dto.nome);
  });

  it('deve lançar exceção se usuário não existir no update', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.update(1, {} as any)).rejects.toThrow(HttpException);
  });

  it('deve lançar erro se função for inválida no update', async () => {
    const user = { id: 1, nome: 'Ex', email: 'x@x.com', funcao: Role.CLIENT };
    mockRepo.findOne.mockResolvedValue(user);

    await expect(
      service.update(1, { funcao: 'gerente' } as any),
    ).rejects.toThrow(HttpException);
  });
});
