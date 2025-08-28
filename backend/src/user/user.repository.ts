import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { UpdateRepo } from './types/update-repo';
import { RepoDto } from './dto/repo.dto';
import { CreateRepo } from './types/create-repo';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(user: UserDto): Promise<UserDto> {
    return this.userModel.insertOne(user);
  }

  async get(userId: string): Promise<UserDto> {
    const user = await this.find(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  find(userId: string): Promise<UserDto | null> {
    return this.userModel.findOne({ id: userId });
  }

  findByEmail(email: string): Promise<UserDto | null> {
    return this.userModel.findOne({ email });
  }

  async addRepo(userId: string, repo: CreateRepo): Promise<UserDto> {
    const user = await this.userModel.findOneAndUpdate(
      {
        id: userId,
        'repo.owner': { $ne: repo.owner },
        'repo.name': { $ne: repo.name },
      },
      { $push: { repos: repo } },
      { new: true },
    );

    if (!user) {
      throw new Error('Repo already exists');
    }

    return user;
  }

  async deleteRepo(
    userId: string,
    repoOwner: string,
    repoName: string,
  ): Promise<UserDto> {
    const user = await this.userModel.findOneAndUpdate(
      { id: userId },
      { $pull: { repos: { owner: repoOwner, name: repoName } } },
      { new: true },
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateRepo(
    userId: string,
    repoOwner: string,
    repoName: string,
    repoUpdate: UpdateRepo,
  ): Promise<UserDto> {
    const user = await this.userModel.findOneAndUpdate(
      { id: userId, 'repos.owner': repoOwner, 'repos.name': repoName },
      {
        $set: {
          'repos.$.starsCount': repoUpdate.starsCount,
          'repos.$.forksCount': repoUpdate.forksCount,
          'repos.$.issuesCount': repoUpdate.issuesCount,
          'repos.$.createdAt': repoUpdate.createdAt,
          'repos.$.url': repoUpdate.url,
        },
      },
      { new: true },
    );

    if (!user) {
      throw new Error('User not found or invalid repo');
    }

    return user;
  }
}
