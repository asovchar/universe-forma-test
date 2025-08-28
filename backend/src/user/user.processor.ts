import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { UserService } from './user.service';
import { RefreshRepoJobPayloadDto } from './dto/refresh-repo-job-payload.dto';
import {
  USER_QUEUE_NAME,
  USER_QUEUE_REFRESH_REPO_JOB_NAME,
} from './user.constants';

@Processor(USER_QUEUE_NAME)
export class UserProcessor {
  constructor(private readonly userService: UserService) {}

  @Process(USER_QUEUE_REFRESH_REPO_JOB_NAME)
  async refreshRepo(job: Job<RefreshRepoJobPayloadDto>): Promise<void> {
    await this.userService.refreshRepo(job.data.userId, job.data.repoPath);
  }
}
