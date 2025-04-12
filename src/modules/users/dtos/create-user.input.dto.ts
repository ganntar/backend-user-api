import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '@/shared/enums/role.enum';

export class CreateUserInputDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(Role, { message: 'Função deve ser admin ou cliente' })
  funcao: Role;
}