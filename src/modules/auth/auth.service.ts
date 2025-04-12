import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login( @Body() signInDto: { email: string; senha: string }  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findEmail(signInDto.email);
    console.log(user?.senha)
    console.log(signInDto.senha)
    if (user?.senha !== signInDto.senha) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}