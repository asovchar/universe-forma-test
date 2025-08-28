import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AccessTokenPayloadDto } from './dto/access-token-payload.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload: AccessTokenPayloadDto = {
      id: user.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User is already registered');
    }

    const user = await this.userService.create(
      email,
      bcrypt.hashSync(password, 10),
    );
    const payload: AccessTokenPayloadDto = {
      id: user.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
