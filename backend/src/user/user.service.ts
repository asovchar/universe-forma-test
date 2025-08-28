import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UpdateRepo } from './types/update-repo';
import * as uuid from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import {
  USER_QUEUE_NAME,
  USER_QUEUE_REFRESH_REPO_JOB_NAME,
} from './user.constants';
import { CreateRepo } from './types/create-repo';
import { GithubService } from '../github/github.service';
import { ReposResponseDto } from './dto/repos-response.dto';
import { RepoResponseFormatter } from './formatters/repo-response.formatter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue(USER_QUEUE_NAME) private readonly userQueue: Queue,
    private readonly githubService: GithubService,
    private readonly repoResponseFormatter: RepoResponseFormatter,
  ) {}

  async create(email: string, password: string): Promise<UserDto> {
    const user: UserDto = {
      id: uuid.v4(),
      email,
      password,
      repos: [],
    };

    return this.userRepository.create(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return this.userRepository.findByEmail(email);
  }

  async getRepos(userId: string): Promise<ReposResponseDto> {
    const user = await this.userRepository.get(userId);

    return this.repoResponseFormatter.format(user);
  }

  async addRepo(userId: string, path: string): Promise<ReposResponseDto> {
    const user = await this.userRepository.get(userId);

    const [owner, name] = path.split('/');
    const repoExists = user.repos.some(
      (repo) => repo.owner === owner && repo.name === name,
    );

    if (repoExists) {
      return this.repoResponseFormatter.format(user);
    }

    const repo: CreateRepo = {
      owner,
      name,
    };

    const updatedUser = await this.userRepository.addRepo(userId, repo);

    await this.userQueue.add(USER_QUEUE_REFRESH_REPO_JOB_NAME, {
      userId,
      repoPath: path,
    });

    return this.repoResponseFormatter.format(updatedUser);
  }

  async deleteRepo(userId: string, path: string): Promise<ReposResponseDto> {
    const [owner, name] = path.split('/');

    const user = await this.userRepository.deleteRepo(userId, owner, name);

    return this.repoResponseFormatter.format(user);
  }

  async refreshRepo(userId: string, path: string): Promise<ReposResponseDto> {
    const repoMetadata = await this.githubService.getRepoMetadata(path);

    if (!repoMetadata) {
      const user = await this.userRepository.get(userId);

      return this.repoResponseFormatter.format(user);
    }

    const [owner, name] = path.split('/');
    const update: UpdateRepo = {
      starsCount: repoMetadata.starsCount,
      forksCount: repoMetadata.forksCount,
      issuesCount: repoMetadata.issuesCount,
      createdAt: repoMetadata.createdAt,
      url: repoMetadata.url,
    };

    const user = await this.userRepository.updateRepo(
      userId,
      owner,
      name,
      update,
    );

    return this.repoResponseFormatter.format(user);
  }
}
