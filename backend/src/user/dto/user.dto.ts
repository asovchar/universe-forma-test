import { Repo } from '../schemas/user.schema';

export class UserDto {
  id: string;
  email: string;
  password: string;
  repos: Repo[];
}
