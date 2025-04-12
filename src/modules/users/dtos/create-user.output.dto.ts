import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Role } from '@/shared/enums/role.enum';
import { Exclude } from 'class-transformer';

export class CreateUserOutputDto {
  @IsNotEmpty()
  @IsNumber()
  id:number;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @Exclude()
  senha: string;

  constructor(partial: Partial<CreateUserOutputDto>) {
    Object.assign(this, partial);
  }

  @IsEnum(Role, { message: 'Função deve ser admin ou cliente' })
  funcao: Role;
}