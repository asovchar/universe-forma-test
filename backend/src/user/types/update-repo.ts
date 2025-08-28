import { RepoDto } from '../dto/repo.dto';

export type UpdateRepo = Omit<RepoDto, 'owner' | 'name'>;
