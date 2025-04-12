import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "./users.entity";
import { IUsersService } from "./interface/users.service.interface";
import { CreateUserOutputDto } from "./dtos/create-user.output.dto";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateUserInputDto } from "./dtos/create-user.input.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
	
	@HttpCode(HttpStatus.OK)
	@Post('create')
  async create(@Body() user: User): Promise<CreateUserOutputDto> {
		return this.usersService.create(user);
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('find/:query')
	async find(@Param('query') query: string): Promise<CreateUserOutputDto[] | null> {
		return this.usersService.find(query);
	}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	@Patch('update/:id')
	async update(@Param('id') id: number, @Body() user: CreateUserInputDto): Promise<CreateUserOutputDto | null> {
		return this.usersService.update(id, user);
	}
}