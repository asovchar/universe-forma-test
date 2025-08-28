import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { ReposResponseDto } from './dto/repos-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('repos')
  getRepos(@Req() req: Request): Promise<ReposResponseDto> {
    return this.userService.getRepos(req['userId'] as string);
  }

  @Post('repos')
  @HttpCode(HttpStatus.OK)
  addRepo(
    @Req() req: Request,
    @Body('path') repoPath: string,
  ): Promise<ReposResponseDto> {
    return this.userService.addRepo(req['userId'] as string, repoPath);
  }

  @Delete('repos/:path')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRepo(
    @Req() req: Request,
    @Param('path') repoPath: string,
  ): Promise<ReposResponseDto> {
    return this.userService.deleteRepo(req['userId'] as string, repoPath);
  }

  @Post('repos/:path/refresh')
  @HttpCode(HttpStatus.OK)
  refreshRepo(
    @Req() req: Request,
    @Param('path') repoPath: string,
  ): Promise<ReposResponseDto> {
    return this.userService.refreshRepo(req['userId'] as string, repoPath);
  }
}
