import { RepoDto } from '../dto/repo.dto';

export type CreateRepo = Pick<RepoDto, 'owner' | 'name'>;
