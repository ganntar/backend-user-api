import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { usersProviders } from './modules/users/users.providers';
import { UsersService } from './modules/users/users.service';
import { CqrsModule } from '@nestjs/cqrs';


@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule
  ],
  controllers: [],
  providers: [...usersProviders, UsersService],
})
export class AppModule {}
