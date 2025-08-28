import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import githubConfig from './github.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(githubConfig)],
      useFactory: (config: ConfigType<typeof githubConfig>) => ({
        baseURL: config.baseUrl,
      }),
      inject: [githubConfig.KEY],
    }),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
