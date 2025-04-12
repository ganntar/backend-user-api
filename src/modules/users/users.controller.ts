import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
	
	@HttpCode(HttpStatus.OK)
	@Post('create')
  async create(@Body() user: User) {
		return this.usersService.create(user);
	}

	@HttpCode(HttpStatus.OK)
	@Patch('find/:query')
	@Get()
	async findOne(@Param('query') query: string): Promise<User | null> {
		return this.usersService.find(query);
	}
}