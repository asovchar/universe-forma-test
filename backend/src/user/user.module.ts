import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { BullModule } from '@nestjs/bull';
import { UserProcessor } from './user.processor';
import { USER_QUEUE_NAME } from './user.constants';
import { GithubModule } from '../github/github.module';
import { RepoResponseFormatter } from './formatters/repo-response.formatter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({ name: USER_QUEUE_NAME }),
    GithubModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserProcessor,
    RepoResponseFormatter,
  ],
  exports: [UserService],
})
export class UserModule {}
