import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{
  @IsNotEmpty({ message: 'Email não pode ser vazio' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;  
}
