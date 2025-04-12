import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@/database/database.module';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...usersProviders,
    UsersService
  ],
  exports: [
    UsersService
  ],
  controllers: [UsersController],
})
export class UsersModule {}
