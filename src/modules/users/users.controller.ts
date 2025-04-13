import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { User } from "./users.entity";
import { CreateUserOutputDto } from "./dtos/create-user.output.dto";
import { UsersService } from "./users.service";
import { CreateUserInputDto } from "./dtos/create-user.input.dto";
import { Public } from "@/shared/decorators/public.guard.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
	
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('create')
  async create(@Body() user: User): Promise<CreateUserOutputDto> {
		return this.usersService.create(user);
	}

	@HttpCode(HttpStatus.OK)
	@Get('find/:query')
	async find(@Param('query') query: string): Promise<CreateUserOutputDto[] | null> {
		return this.usersService.find(query);
	}

	@HttpCode(HttpStatus.OK)
	@Patch('update/:id')
	async update(@Param('id') id: number, @Body() user: CreateUserInputDto): Promise<CreateUserOutputDto | null> {
		return this.usersService.update(id, user);
	}
}