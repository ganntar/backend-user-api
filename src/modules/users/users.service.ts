import { Body, HttpException, HttpStatus, Inject, Injectable, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserInputDto } from './dtos/create-user.input.dto';
import { CreateUserOutputDto } from './dtos/create-user.output.dto';
import { IUsersService } from './interface/users.service.interface';
import e from 'express';
import { Role } from '@/shared/enums/role.enum';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';


@Injectable()
export class UsersService implements IUsersService {
  constructor(   
    @Inject('USER_REPOSITORY') private userRepo: Repository<User>
  ) 
  {}

  async create(@Body() user: CreateUserInputDto): Promise<CreateUserOutputDto> {
    //const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      ...user,
 //     password: hashPassword,
    };

    this.userRepo.create(newUser);
    const response = await this.userRepo.save(newUser);

    return response;
  }

  async findEmail(email: string): Promise<User | null> {
    const response = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'senha'], 
    });
    console.log(response)
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