
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() signInDto: { email: string; senha: string }) {
      return this.authService.login(signInDto);
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }
  