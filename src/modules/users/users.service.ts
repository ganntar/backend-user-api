import { Body, HttpException, HttpStatus, Inject, Injectable, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserInputDto } from './dtos/create-user.input.dto';
import { CreateUserOutputDto } from './dtos/create-user.output.dto';
import { IUsersService } from './interface/users.service.interface';
import { Role } from '@/shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';



@Injectable()
export class UsersService implements IUsersService {
  constructor(   
    @Inject('USER_REPOSITORY') private userRepo: Repository<User>
  ) 
  {}

  async create(@Body() user: CreateUserInputDto): Promise<CreateUserOutputDto> {
    if(user.funcao !== Role.ADMIN && user.funcao !== Role.CLIENT) {
      throw new HttpException(
        'Função digitada não é valida!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.userRepo.findOne({ where: { email: user.email } });
    if (existingUser) {
      throw new HttpException(
        'Usuario já existe!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.senha, salt);
    
    const newUser = {
      ...user,
      senha: hashedPassword,
    };

    this.userRepo.create(newUser);
    const response = await this.userRepo.save(newUser);

    return plainToInstance(CreateUserOutputDto,response);
  }

  async findEmail(email: string): Promise<User | null> {
    const response = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'senha'], 
    });
    if (!response) {
      throw new HttpException(
        'Usuario não encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }
    return response;
  }


  async find(query: string): Promise<CreateUserOutputDto[] | null> {
    if (!query) return [];

    const lowered = query.toLowerCase();
  
    const user = this.userRepo
    .createQueryBuilder('user')
    .select(['user.id', 'user.nome', 'user.email', 'user.funcao']) // não retorna senha
    .where('LOWER(user.nome) LIKE :term', { term: `%${lowered}%` })
    .orWhere('LOWER(user.email) LIKE :term', { term: `%${lowered}%` })
    .orWhere('LOWER(user.funcao) LIKE :term', { term: `%${lowered}%` })
    .getMany();
  
    if (!user) {
      throw new HttpException(
        'Usuario não encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }
  
    return user;
  }

  async update(id: number, user: CreateUserInputDto): Promise<CreateUserOutputDto | null> {
    const existingUser = await this.userRepo.findOne({ where: { id } });
    if (!existingUser) {
      throw new HttpException(
        'Usuario não encontrado!',
        HttpStatus.NOT_FOUND,
      );

    }

    if(user.funcao !== Role.ADMIN && user.funcao !== Role.CLIENT) {
      throw new HttpException(
        'Usuário não tem permissão para atualizar!',
        HttpStatus.BAD_REQUEST,
      );


    }

    const updatedUser = { ...existingUser, ...user };
    await this.userRepo.save(updatedUser);

    const userUpdated = await this.userRepo.findOne({ where: { id } });

    if (!userUpdated) { 
      throw new Error('Erro ao atualizar usuário')
    }
    return userUpdated;
  }
}