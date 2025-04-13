import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './guards/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Body() login: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findEmail(login.email);
    if(!user) throw new HttpException('Usuario não existe!', HttpStatus.NOT_FOUND);
  
    const isPasswordValid = await bcrypt.compare(login.senha, user.senha, );

    if (!isPasswordValid) {
      throw new HttpException('Senha Invalida!', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
