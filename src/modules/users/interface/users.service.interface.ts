import { CreateUserInputDto } from "../dtos/create-user.input.dto";
import { CreateUserOutputDto } from "../dtos/create-user.output.dto";
import { User } from "../users.entity";

export interface IUsersService {
    create(user: CreateUserInputDto): Promise<CreateUserOutputDto>;
    findEmail(email: string): Promise<User | null>;
    find(username: string): Promise<CreateUserOutputDto[] | null>;
    update(id: number, user: User): Promise<CreateUserOutputDto | null>;
}