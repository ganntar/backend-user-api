import { Role } from '@/shared/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  nome: string;

  @Column({ length: 500 })
  email: string;

  @Column()
  senha: string;

  @Column({ type: 'varchar'})
  funcao: Role;
}