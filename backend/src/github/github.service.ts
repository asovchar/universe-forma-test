import { Injectable } from '@nestjs/common';
import { RepoMetadataDto } from './dto/repo-metadata.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubRepoResponseDto } from './dto/github-repo-response.dto';

@Injectable()
export class GithubService {
  constructor(private readonly httpClient: HttpService) {}

  async getRepoMetadata(name: string): Promise<RepoMetadataDto | null> {
    try {
      const response = await firstValueFrom(
        this.httpClient.get<GithubRepoResponseDto>(`/repos/${name}`),
      ).then((resp) => resp.data);

      return {
        url: response.html_url,
        starsCount: response.stargazers_count,
        forksCount: response.forks_count,
        issuesCount: response.open_issues_count,
        createdAt: new Date(response.created_at),
      };
    } catch (err) {
      return null;
    }
  }
}
