export class ReposResponseDto {
  repos: {
    owner: string;
    name: string;
    url?: string;
    starsCount?: number;
    forksCount?: number;
    issuesCount?: number;
    createdAt?: number;
  }[];
}
