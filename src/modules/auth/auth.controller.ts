
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
import { LoginDto } from './guards/dtos/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { Public } from '@/shared/decorators/public.guard.decorator';

  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Body() login: LoginDto) {
      return this.authService.login(login);
    }
  }
  