export interface IUsersService {
    create(user: any): Promise<any>;
    findOne(username: string): Promise<any | undefined>;
}