import { Body, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './users.entity';


@Injectable()
export class UsersService {
  constructor(   
    @Inject('USER_REPOSITORY') private userRepo: Repository<User>
  ) 
  {}

  async create(@Body() user: User): Promise<User> {
    //const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      ...user,
 //     password: hashPassword,
    };

    this.userRepo.create(newUser);
    const response = await this.userRepo.save(newUser);

    return response;
  }

  async find(query: string): Promise<User | null> {
    const response = this.userRepo.findOne({ where: { email: query } });
    if (!response) {
      throw new Error('User not found')
    }
    return response;
  }
}