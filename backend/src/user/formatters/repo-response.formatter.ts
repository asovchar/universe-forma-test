import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { ReposResponseDto } from '../dto/repos-response.dto';

@Injectable()
export class RepoResponseFormatter {
  format(user: UserDto): ReposResponseDto {
    return {
      repos: user.repos.map((repo) => {
        const result: ReposResponseDto['repos'][number] = {
          owner: repo.owner,
          name: repo.name,
        };

        if (repo.url) {
          result.url = repo.url;
        }

        if (repo.starsCount) {
          result.starsCount = repo.starsCount;
        }

        if (repo.forksCount) {
          result.forksCount = repo.forksCount;
        }

        if (repo.issuesCount) {
          result.issuesCount = repo.issuesCount;
        }

        if (repo.createdAt) {
          result.createdAt = repo.createdAt.getTime();
        }

        return result;
      }),
    };
  }
}
